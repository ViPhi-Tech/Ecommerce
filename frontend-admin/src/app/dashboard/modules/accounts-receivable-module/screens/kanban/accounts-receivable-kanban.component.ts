import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  effect,
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
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

@Component({
  selector: 'fuse-accounts-receivable-kanban',
  templateUrl: './accounts-receivable-kanban.component.html',
  styleUrls: ['./accounts-receivable-kanban.component.scss'],
  imports: [CommonModule, ButtonModule, NgIcon, KanbanComponent],
  providers: [CurrencyPipe],
})
export class AccountsReceivableKanbanComponent implements OnInit {
  private router = inject(Router);
  private coreService = inject(CoreService);
  private state = inject(AccountsReceivableState);
  private currencyPipe = inject(CurrencyPipe);

  // Signals
  kanbanColumns = signal<KanbanColumn[]>([]);

  // Computed
  loading = computed(() => this.state.loading());
  accountsReceivableList = computed(() => this.state.accountsReceivableList());

  constructor() {
    this.coreService.setPageTitle('Financeiro', '');

    // Effect que executa automaticamente quando accountsReceivableList mudar
    effect(() => {
      const accounts = this.accountsReceivableList();
      if (accounts.length > 0) {
        this.setupKanbanColumns();
      }
    });
  }

  ngOnInit() {
    this.loadAccountsReceivable();
  }

  async loadAccountsReceivable() {
    await this.state.getAccountsReceivableList(true);
  }

  private setupKanbanColumns() {
    const accounts = this.accountsReceivableList();

    // Definir as colunas do Kanban
    const columns: KanbanColumn[] = [
      {
        id: 'pending',
        title: 'Pendente',
        color: 'yellow',
        cards: [],
        cardsActions: [
          {
            label: 'Editar',
            icon: 'lucideSquarePen',
            action: card => {
              this.editAccount(card);
            },
          },
          {
            label: 'Visualizar',
            icon: 'lucideEye',
            action: card => {
              this.viewAccount(card);
            },
          },
          {
            label: 'Excluir',
            icon: 'lucideTrash2',
            action: card => {
              this.deleteAccount(card);
            },
          },
        ],
        maxCards: 50,
      },
      {
        id: 'due_soon',
        title: 'Vence em Breve',
        color: 'blue',
        cards: [],
        cardsActions: [
          {
            label: 'Editar',
            icon: 'lucideSquarePen',
            action: card => {
              this.editAccount(card);
            },
          },
          {
            label: 'Marcar como Recebido',
            icon: 'lucideCheck',
            action: card => {
              this.markAsReceived(card);
            },
          },
          {
            label: 'Visualizar',
            icon: 'lucideEye',
            action: card => {
              this.viewAccount(card);
            },
          },
        ],
        maxCards: 30,
      },
      {
        id: 'overdue',
        title: 'Vencidas',
        color: 'red',
        cards: [],
        cardsActions: [
          {
            label: 'Receber Urgente',
            icon: 'lucideAlertTriangle',
            action: card => {
              this.markAsReceived(card);
            },
          },
          {
            label: 'Editar',
            icon: 'lucideSquarePen',
            action: card => {
              this.editAccount(card);
            },
          },
          {
            label: 'Visualizar',
            icon: 'lucideEye',
            action: card => {
              this.viewAccount(card);
            },
          },
        ],
        maxCards: 20,
      },
      {
        id: 'received',
        title: 'Recebidas',
        color: 'green',
        cards: [],
        cardsActions: [
          {
            label: 'Visualizar',
            icon: 'lucideEye',
            action: card => {
              this.viewAccount(card);
            },
          },
          {
            label: 'Gerar Comprovante',
            icon: 'lucideDownload',
            action: card => {
              this.generateReceipt(card);
            },
          },
        ],
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
      id: account.uuid,
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

  onCardClick(card: any) {
    console.log('Card clicked:', card);
    // Navegar para detalhes ou edição da conta
    // const account = card['accountData'] as IAccountsReceivable;
    // this.router.navigate([
    //   { outlets: { drawer: ['accounts-receivable', account.uuid] } },
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
    this.state.updateAccountReceivableStatus(accountId, newStatus);
  }

  navigateToList() {
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
        { outlets: { drawer: ['accounts-receivable', account.uuid] } },
      ]);
    }
  }

  viewAccount(card: KanbanCard) {
    const account = card['accountData'] as IAccountsReceivable;
    if (account) {
      this.router.navigate([
        { outlets: { drawer: ['accounts-receivable', account.uuid, 'view'] } },
      ]);
    }
  }

  deleteAccount(card: KanbanCard) {
    const account = card['accountData'] as IAccountsReceivable;
    if (account) {
      if (
        confirm(
          `Tem certeza que deseja excluir a conta "${account.description}"?`
        )
      ) {
        // Implementar lógica de exclusão
        this.state.removeAccountReceivable(account.id);
      }
    }
  }

  markAsReceived(card: KanbanCard) {
    const account = card['accountData'] as IAccountsReceivable;
    if (account) {
      if (confirm(`Marcar a conta "${account.description}" como recebida?`)) {
        this.updateAccountStatus(account.id, 'received');
      }
    }
  }

  generateReceipt(card: KanbanCard) {
    const account = card['accountData'] as IAccountsReceivable;
    if (account) {
      console.log('Gerando comprovante para:', account.description);
      // Implementar lógica de geração de comprovante
      alert('Funcionalidade de gerar comprovante será implementada em breve.');
    }
  }
}
