import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { NgIcon } from '@ng-icons/core';
import { Router } from '@angular/router';
import { AccountsPayableState } from '../../accounts-payable.state';
import { IAccountsPayable } from 'app/shared/interfaces/accounts-payable/AccountsPayable';
import { KanbanComponent, KanbanColumn, KanbanCard } from 'app/shared/components/kanban/kanban.component';

@Component({
  selector: 'fuse-accounts-payable-kanban',
  templateUrl: './accounts-payable-kanban.component.html',
  styleUrls: ['./accounts-payable-kanban.component.scss'],
  imports: [CommonModule, ButtonModule, NgIcon, KanbanComponent],
})
export class AccountsPayableKanbanComponent implements OnInit {
  private router = inject(Router);
  private state = inject(AccountsPayableState);

  // Signals
  kanbanColumns = signal<KanbanColumn[]>([]);

  // Computed
  loading = computed(() => this.state.loading());
  accountsPayableList = computed(() => this.state.accountsPayableList());

  ngOnInit() {
    this.loadAccountsPayable();
    this.setupKanbanColumns();
  }

  async loadAccountsPayable() {
    await this.state.getAccountsPayableList();
    this.setupKanbanColumns();
  }

  private setupKanbanColumns() {
    const accounts = this.accountsPayableList();
    
    // Definir as colunas do Kanban
    const columns: KanbanColumn[] = [
      {
        id: 'pending',
        title: 'Pendente',
        color: 'yellow',
        cards: [],
        maxCards: 50
      },
      {
        id: 'due_soon',
        title: 'Vence em Breve',
        color: 'blue',
        cards: [],
        maxCards: 30
      },
      {
        id: 'overdue',
        title: 'Vencidas',
        color: 'red',
        cards: [],
        maxCards: 20
      },
      {
        id: 'paid',
        title: 'Pagas',
        color: 'green',
        cards: []
      }
    ];

    // Mapear contas para cards e distribuir nas colunas
    accounts.forEach(account => {
      const card = this.mapAccountToCard(account);
      const status = this.determineAccountStatus(account);
      
      const column = columns.find(col => col.id === status);
      if (column) {
        column.cards.push(card);
      }
    });

    this.kanbanColumns.set(columns);
  }

  private mapAccountToCard(account: IAccountsPayable): KanbanCard {
    return {
      id: account.uuid,
      title: `${account.supplier?.tradeName || 'Fornecedor'} - ${account.description}`,
      description: `Valor: R$ ${account.amount.toFixed(2)}`,
      status: this.determineAccountStatus(account),
      priority: this.determinePriority(account),
      assignee: 'Sistema',
      dueDate: account.dueDate,
      tags: [
        account.recurringPurchase ? 'Recorrente' : 'Única',
        `R$ ${account.amount.toFixed(2)}`
      ],
      // Dados adicionais para uso posterior
      accountData: account
    };
  }

  private determineAccountStatus(account: IAccountsPayable): string {
    const now = new Date();
    const dueDate = new Date(account.dueDate);
    const daysDifference = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (account.status === 'paid') {
      return 'paid';
    }

    if (daysDifference < 0) {
      return 'overdue';
    }

    if (daysDifference <= 7) {
      return 'due_soon';
    }

    return 'pending';
  }

  private determinePriority(account: IAccountsPayable): 'low' | 'medium' | 'high' {
    const now = new Date();
    const dueDate = new Date(account.dueDate);
    const daysDifference = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

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
    // Navegar para detalhes ou edição da conta
    const account = card['accountData'] as IAccountsPayable;
    this.router.navigate([
      { outlets: { drawer: ['accounts-payable', account.uuid] } },
    ]);
  }

  navigateToList() {
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
}
