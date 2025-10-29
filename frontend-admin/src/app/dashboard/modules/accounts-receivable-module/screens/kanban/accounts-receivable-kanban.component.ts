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
import { AccountsReceivableState } from '../../accounts-receivable.state';
import { IAccountsReceivable } from 'app/shared/interfaces/accounts-receivable/AccountsReceivable';
import {
  KanbanComponent,
  KanbanColumn,
  KanbanCard,
} from 'app/shared/components/kanban/kanban.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CoreService } from 'app/shared/services/core.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AccountsReceivableService } from '../../accounts-receivable.service';
import { PeriodRange } from 'app/shared/components/period/period.component';
import { ClientState } from '../../../client-module/client.state';
import { IClient } from 'app/shared/interfaces/client/Client';
import dayjs from 'dayjs';

@Component({
  selector: 'fuse-accounts-receivable-kanban',
  templateUrl: './accounts-receivable-kanban.component.html',
  styleUrls: ['./accounts-receivable-kanban.component.scss'],
  imports: [CommonModule, ButtonModule, SelectModule, FormsModule, NgIcon, KanbanComponent],
  providers: [CurrencyPipe],
})
export class AccountsReceivableKanbanComponent implements OnInit {
  private router = inject(Router);
  private coreService = inject(CoreService);
  private state = inject(AccountsReceivableState);
  private confirmationService = inject(ConfirmationService);
  private accountsReceivableService = inject(AccountsReceivableService);
  private currencyPipe = inject(CurrencyPipe);
  private destroyedRef = inject(DestroyRef);
  private toast = inject(MessageService);
  private clientState = inject(ClientState);

  // Signals
  kanbanColumns = signal<KanbanColumn[]>([]);
  selectedPeriod = signal<PeriodRange | null>(null);
  selectedClientId = signal<string | null>(null);
  selectedClientIdModel: string | null = null;
  clientOptions = signal<{label: string, value: string}[]>([]);

  // Computed
  loading = computed(() => this.state.loading());
  accountsReceivableList = computed(() => {
    const accounts = this.state.accountsReceivableList();
    const selectedClient = this.selectedClientId();
    
    if (!selectedClient) {
      return accounts;
    }
    
    return accounts.filter(account => account.client?.id === selectedClient);
  });
  clientsLoading = computed(() => this.clientState.loading());

  constructor() {
    this.coreService.setPageTitle('Financeiro', '');

    const localStoragePeriod = localStorage.getItem('received_period');
    if (localStoragePeriod) {
      this.selectedPeriod.set(JSON.parse(localStoragePeriod));
    }

    // Effect que executa automaticamente quando accountsReceivableList mudar
    effect(() => {
      const accounts = this.accountsReceivableList();
      if (accounts.length > 0) {
        this.setupKanbanColumns();
      }
    });

    // Effect para carregar opções de clientes
    effect(() => {
      const clients = this.clientState.clientList();
      const options = clients.map((client: IClient) => ({
        label: client.fullName,
        value: client.id
      }));
      this.clientOptions.set(options);
    });
  }

  ngOnInit() {
    // Salvar preferência atual como kanban
    localStorage.setItem('accounts-receivable-view-preference', 'kanban');

    this.loadAccountsReceivable();
    this.loadClients();
  }

  async loadAccountsReceivable() {
    await this.state.getAccountsReceivableList(true, {
      startDate: dayjs(this.selectedPeriod()?.startDate).format('YYYY-MM-DD'),
      endDate: dayjs(this.selectedPeriod()?.endDate).format('YYYY-MM-DD'),
    });
  }

  private setupKanbanColumns() {
    const accounts = this.accountsReceivableList();

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
        id: 'received',
        title: 'Recebidas',
        color: 'green',
        cards: [],
        cardsActions: actions,
        filter: {
          date: true
        }
      },
    ];

    // Mapear contas para cards e distribuir nas colunas
    accounts.forEach((account: IAccountsReceivable) => {
      const card = this.mapAccountToCard(account);
      const status = account.status; // Usar o status diretamente do objeto account
      const column = columns.find(col => col.id === status);
      if (column) {
        column.cards.push(card);
      }
    });

    this.kanbanColumns.set(columns);
  }

  private mapAccountToCard(account: IAccountsReceivable): KanbanCard {
    return {
      id: account.id,
      title: `${account.client?.fullName || 'Cliente'} - ${account.description}`,
      description: `Valor: R$ ${account.amount.toFixed(2)}`,
      status: account?.status || 'pending',
      priority: this.determinePriority(account),
      assignee: 'Sistema',
      dueDate: account.dueDate,
      tags: [
        account.recurringIncome ? 'Recorrente' : 'Única',
        `${this.currencyPipe.transform(account.amount, 'BRL')}`,
      ],
      // Dados adicionais para uso posterior
      accountData: account,
    };
  }

  private determinePriority(
    account: IAccountsReceivable
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

      // Atualizar o status da conta a receber no backend
      const movedCard = event.item.data as KanbanCard;
      const account = movedCard['accountData'] as IAccountsReceivable;
      const newStatus = targetColumn;

      if (account && newStatus) {
        this.updateAccountStatus(account.id, newStatus);
      }
    }
  }

  private updateAccountStatus(accountId: number, newStatus: any) {
    // Atualizar o status no state
    if (newStatus !== 'received') {
      newStatus = 'pending';
    }
    this.loadAccountsReceivable();
  }

  navigateToList() {
    // Salvar preferência de visualização
    localStorage.setItem('accounts-receivable-view-preference', 'list');
    this.router.navigate(['/dashboard/accounts-receivable/list']);
  }

  addNewAccount() {
    this.router.navigate([
      { outlets: { drawer: ['accounts-receivable', 'new'] } },
    ]);
  }

  refreshData() {
    this.loadAccountsReceivable();
  }

  editAccount(card: KanbanCard) {
    const account = card['accountData'] as IAccountsReceivable;
    if (account) {
      this.router.navigate([
        { outlets: { drawer: ['accounts-receivable', account.id] } },
      ]);
    }
  }

  viewAccount(card: KanbanCard) {
    const account = card['accountData'] as IAccountsReceivable;
    if (account) {
      this.router.navigate([
        { outlets: { drawer: ['accounts-receivable', account.id, 'view'] } },
      ]);
    }
  }

  deleteAccount(card: KanbanCard) {
    const account = card['accountData'] as IAccountsReceivable;
    if (account) {
      this.confirmationService.confirm({
        message: 'Você tem certeza que deseja excluir esta conta a receber?',
        header: 'Confirmação de Exclusão',
        icon: 'pi pi-exclamation-triangle text-red-500',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        acceptButtonStyleClass: 'p-button-danger',
        rejectButtonStyleClass: 'p-button-secondary',
        accept: () => {
          this.accountsReceivableService
            .delete(account.id.toString())
            .pipe(takeUntilDestroyed(this.destroyedRef))
            .subscribe({
              next: () => {
                this.toast.add({
                  severity: 'success',
                  summary: 'Sucesso',
                  detail: 'Conta a receber excluída com sucesso',
                });
                this.state.removeAccountReceivable(account.id);
              },
              error: () => {
                this.toast.add({
                  severity: 'error',
                  summary: 'Erro',
                  detail: 'Erro ao excluir conta a receber',
                });
              },
            });
        },
      });
    }
  }

  markAsReceived(card: KanbanCard) {
    const account = card['accountData'] as IAccountsReceivable;
    if (account) {
      if (confirm(`Marcar a conta "${account.description}" como recebida?`)) {
        this.updateAccountStatus(account.id, 'received');
        this.loadAccountsReceivable();
      }
    }
  }

  onPeriodChange(data: any){
    this.selectedPeriod.set({
      ...data.period
    })
    localStorage.setItem('received_period', JSON.stringify(data.period));
    this.loadAccountsReceivable();
  }

  async loadClients() {
    await this.clientState.getClientList(true);
  }

  onClientFilterChange(event: any) {
    this.selectedClientIdModel = event.value;
    this.selectedClientId.set(event.value);
    // O filtro será aplicado automaticamente através do computed
  }

  clearClientFilter() {
    this.selectedClientId.set(null);
  }
}
