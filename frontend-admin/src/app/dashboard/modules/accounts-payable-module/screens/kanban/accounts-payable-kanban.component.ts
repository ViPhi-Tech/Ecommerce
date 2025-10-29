import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  effect,
  DestroyRef,
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { Router } from '@angular/router';
import { AccountsPayableState } from '../../accounts-payable.state';
import { IAccountsPayable } from 'app/shared/interfaces/accounts-payable/AccountsPayable';
import {
  KanbanComponent,
  KanbanColumn,
  KanbanCard,
} from 'app/shared/components/kanban/kanban.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CoreService } from 'app/shared/services/core.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AccountsPayableService } from '../../accounts-payable.service';
import { PeriodRange } from 'app/shared/components/period/period.component';
import { SupplierState } from '../../../supplier-module/supplier.state';
import { ISupplier } from 'app/shared/interfaces/supplier/Supplier';
import dayjs from 'dayjs';

@Component({
  selector: 'fuse-accounts-payable-kanban',
  templateUrl: './accounts-payable-kanban.component.html',
  styleUrls: ['./accounts-payable-kanban.component.scss'],
  imports: [
    CommonModule,
    ButtonModule,
    SelectModule,
    FormsModule,
    NgIcon,
    KanbanComponent,
  ],
  providers: [CurrencyPipe],
})
export class AccountsPayableKanbanComponent implements OnInit {
  private router = inject(Router);
  private coreService = inject(CoreService);
  private state = inject(AccountsPayableState);
  private confirmationService = inject(ConfirmationService);
  private accountsPayableService = inject(AccountsPayableService);
  private currencyPipe = inject(CurrencyPipe);
  private destroyedRef = inject(DestroyRef);
  private toast = inject(MessageService);
  private supplierState = inject(SupplierState);

  // Signals
  kanbanColumns = signal<KanbanColumn[]>([]);
  selectedPeriod = signal<PeriodRange | null>(null);
  selectedSupplierId = signal<string | null>(null);
  selectedSupplierIdModel: string | null = null;
  supplierOptions = signal<{ label: string; value: string }[]>([]);

  // Computed
  loading = computed(() => this.state.loading());
  accountsPayableList = computed(() => {
    const accounts = this.state.accountsPayableList();
    const selectedSupplier = this.selectedSupplierId();

    if (!selectedSupplier) {
      return accounts;
    }

    return accounts.filter(
      account => account.supplier?.id === parseInt(selectedSupplier)
    );
  });
  suppliersLoading = computed(() => this.supplierState.loading());

  constructor() {
    this.coreService.setPageTitle('Financeiro', '');

    const localStoragePeriod = localStorage.getItem('payable_period');
    if (localStoragePeriod) {
      this.selectedPeriod.set(JSON.parse(localStoragePeriod));
    }

    // Effect que executa automaticamente quando accountsPayableList mudar
    effect(() => {
      const accounts = this.accountsPayableList();
      if (accounts.length > 0) {
        this.setupKanbanColumns();
      }
    });

    // Effect para carregar opções de fornecedores
    effect(() => {
      const suppliers = this.supplierState.supplierList();
      const options = suppliers.map((supplier: ISupplier) => ({
        label: supplier.tradeName || supplier.legalName,
        value: supplier.id.toString(),
      }));
      this.supplierOptions.set(options);
    });
  }

  ngOnInit() {
    // Salvar preferência atual como kanban
    localStorage.setItem('accounts-payable-view-preference', 'kanban');

    this.loadAccountsPayable();
    this.loadSuppliers();
  }

  async loadAccountsPayable() {
    await this.state.getAccountsPayableList(true);
  }

  private setupKanbanColumns() {
    const accounts = this.accountsPayableList();

    const actions = [
      {
        label: 'Editar',
        icon: 'lucideSquarePen',
        action: (card: KanbanCard) => {
          this.editAccount(card);
        },
      },
      {
        label: 'Visualizar',
        icon: 'lucideEye',
        action: (card: KanbanCard) => {
          this.viewAccount(card);
        },
      },
      {
        label: 'Excluir',
        icon: 'lucideTrash2',
        action: (card: KanbanCard) => {
          this.deleteAccount(card);
        },
      },
    ];

    // Definir as colunas do Kanban
    const columns: KanbanColumn[] = [
      {
        id: 'pending',
        title: 'Pendente',
        color: 'yellow',
        cards: [],
        cardsActions: actions,
        maxCards: 50,
      },
      {
        id: 'due_soon',
        title: 'Vence em Breve',
        color: 'blue',
        cards: [],
        cardsActions: actions,
        maxCards: 30,
      },
      {
        id: 'overdue',
        title: 'Vencidas',
        color: 'red',
        cards: [],
        cardsActions: actions,
        maxCards: 20,
      },
      {
        id: 'paid',
        title: 'Pagas',
        color: 'green',
        cards: [],
        cardsActions: actions,
        filter: {
          date: true,
        },
      },
    ];

    // Mapear contas para cards e distribuir nas colunas
    accounts.forEach((account: IAccountsPayable) => {
      const card = this.mapAccountToCard(account);
      const status = account.status; // Usar o status diretamente do objeto account
      const column = columns.find(col => col.id === status);
      if (column) {
        column.cards.push(card);
      }
    });

    this.kanbanColumns.set(columns);
  }

  private mapAccountToCard(account: IAccountsPayable): KanbanCard {
    return {
      id: account.id,
      title: `${account.supplier?.tradeName || 'Fornecedor'} - ${account.description}`,
      description: `Valor: R$ ${account.amount.toFixed(2)}`,
      status: account?.status || 'pending',
      priority: this.determinePriority(account),
      assignee: 'Sistema',
      dueDate: account.dueDate,
      tags: [
        account.recurringPurchase ? 'Recorrente' : 'Única',
        `${this.currencyPipe.transform(account.amount, 'BRL')}`,
      ],
      // Dados adicionais para uso posterior
      accountData: account,
    };
  }

  private determinePriority(
    account: IAccountsPayable
  ): 'low' | 'medium' | 'high' {
    const now = new Date();
    const dueDate = new Date(account.dueDate);
    const daysDifference = Math.ceil(
      (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDifference < 0) {
      return 'high'; // Vencida
    }

    if (daysDifference <= 3) {
      return 'high'; // Vence em até 3 dias
    }

    if (daysDifference <= 7) {
      return 'medium'; // Vence em até 7 dias
    }

    return 'low'; // Vence em mais de 7 dias
  }

  onCardClick(card: any) {
    console.log('Card clicked:', card);
    // Navegar para detalhes ou edição da conta
    // const account = card['accountData'] as IAccountsPayable;
    // this.router.navigate([
    //   { outlets: { drawer: ['accounts-payable', account.id] } },
    // ]);
  }

  onCardDrop(dropEvent: {
    event: CdkDragDrop<KanbanCard[]>;
    sourceColumn: string;
    targetColumn: string;
  }) {
    const { event, sourceColumn, targetColumn } = dropEvent;
    if (sourceColumn === targetColumn) {
      // Reordenar dentro da mesma coluna
      const updatedColumns = this.kanbanColumns().map(column => {
        if (column.id === sourceColumn) {
          const updatedCards = [...column.cards];
          moveItemInArray(
            updatedCards,
            event.previousIndex,
            event.currentIndex
          );
          return { ...column, cards: updatedCards };
        }
        return column;
      });
      this.kanbanColumns.set(updatedColumns);
    } else {
      // Mover entre colunas diferentes
      const updatedColumns = this.kanbanColumns().map(column => {
        if (column.id === sourceColumn) {
          const updatedCards = [...column.cards];
          updatedCards.splice(event.previousIndex, 1);
          return { ...column, cards: updatedCards };
        } else if (column.id === targetColumn) {
          const updatedCards = [...column.cards];
          const movedCard = event.item.data as KanbanCard;
          updatedCards.splice(event.currentIndex, 0, movedCard);
          return { ...column, cards: updatedCards };
        }
        return column;
      });
      this.kanbanColumns.set(updatedColumns);

      // Atualizar o status da conta a pagar no backend
      const movedCard = event.item.data as KanbanCard;
      const account = movedCard['accountData'] as IAccountsPayable;
      const newStatus = targetColumn;

      if (account && newStatus) {
        this.updateAccountStatus(account.id, newStatus);
      }
    }
  }

  private updateAccountStatus(accountId: number, newStatus: any) {
    // Atualizar o status no state
    if (newStatus !== 'paid') {
      newStatus = 'pending';
    }
    this.loadAccountsPayable();
  }

  navigateToList() {
    // Salvar preferência de visualização
    localStorage.setItem('accounts-payable-view-preference', 'list');
    this.router.navigate(['/dashboard/accounts-payable/list']);
  }

  addNewAccount() {
    this.router.navigate([
      { outlets: { drawer: ['accounts-payable', 'new'] } },
    ]);
  }

  refreshData() {
    this.loadAccountsPayable();
  }

  editAccount(card: KanbanCard) {
    const account = card['accountData'] as IAccountsPayable;
    if (account) {
      this.router.navigate([
        { outlets: { drawer: ['accounts-payable', account.id] } },
      ]);
    }
  }

  viewAccount(card: KanbanCard) {
    const account = card['accountData'] as IAccountsPayable;
    if (account) {
      this.router.navigate([
        { outlets: { drawer: ['accounts-payable', account.id, 'view'] } },
      ]);
    }
  }

  deleteAccount(card: KanbanCard) {
    const account = card['accountData'] as IAccountsPayable;
    if (account) {
      this.confirmationService.confirm({
        message: 'Você tem certeza que deseja excluir esta conta a pagar?',
        header: 'Confirmação de Exclusão',
        icon: 'pi pi-exclamation-triangle text-red-500',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        acceptButtonStyleClass: 'p-button-danger',
        rejectButtonStyleClass: 'p-button-secondary',
        accept: () => {
          this.accountsPayableService
            .delete(account.id)
            .pipe(takeUntilDestroyed(this.destroyedRef))
            .subscribe({
              next: () => {
                this.toast.add({
                  severity: 'success',
                  summary: 'Sucesso',
                  detail: 'Conta a pagar excluída com sucesso',
                });
                this.state.removeAccountPayable(account.id);
              },
              error: () => {
                this.toast.add({
                  severity: 'error',
                  summary: 'Erro',
                  detail: 'Erro ao excluir conta a pagar',
                });
              },
            });
        },
      });
    }
  }

  markAsPaid(card: KanbanCard) {
    const account = card['accountData'] as IAccountsPayable;
    if (account) {
      if (confirm(`Marcar a conta "${account.description}" como paga?`)) {
        this.updateAccountStatus(account.id, 'paid');
        this.loadAccountsPayable();
      }
    }
  }

  async loadSuppliers() {
    await this.supplierState.getSupplierList(true);
  }

  onSupplierFilterChange(event: any) {
    this.selectedSupplierIdModel = event.value;
    this.selectedSupplierId.set(event.value);
    // O filtro será aplicado automaticamente através do computed
  }

  clearSupplierFilter() {
    this.selectedSupplierId.set(null);
  }

  onPeriodChange(data: any) {
    this.selectedPeriod.set({
      ...data.period,
    });
    localStorage.setItem('payable_period', JSON.stringify(data.period));
    this.loadAccountsPayable();
  }
}
