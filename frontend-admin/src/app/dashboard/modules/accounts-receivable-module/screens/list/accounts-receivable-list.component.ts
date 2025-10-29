import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from 'app/shared/services/core.service';
import { TableConfig } from 'app/shared/interfaces/table.interfaces';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AccountsReceivableService } from '../../accounts-receivable.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { heightAnimation } from 'app/shared/utils/animations';
import { AccountsReceivableState } from '../../accounts-receivable.state';
import { TableComponent } from 'app/shared/components/table/table.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'fuse-accounts-receivable-list',
  templateUrl: './accounts-receivable-list.component.html',
  animations: [heightAnimation],
  imports: [TableComponent, ButtonModule],
})
export class AccountsReceivableListComponent implements OnInit {
  private router = inject(Router);
  private coreService = inject(CoreService);
  private toast = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private accountsReceivableService = inject(AccountsReceivableService);
  private destroyedRef = inject(DestroyRef);

  state = inject(AccountsReceivableState);

  tableConfig = signal<TableConfig>({
    rowsPerPageOptions: [5, 10, 20],
    rowsPerPage: 10,
    paginator: true,
    pageLinkSize: 5,
    columns: [
      {
        field: 'clientName',
        caption: 'Cliente',
        sortable: true,
        filter: true,
      },
      {
        field: 'description',
        caption: 'Descrição',
        sortable: true,
        filter: true,
      },
      {
        field: 'dueDate',
        caption: 'Data de Vencimento',
        type: 'date',
        sortable: true,
        filter: true,
      },
      {
        field: 'amount',
        caption: 'Valor',
        type: 'currency',
        sortable: true,
        filter: true,
      },
      {
        field: 'statusLabel',
        caption: 'Situação',
        type: 'badge',
        filter: true,
        sortable: true,
        badgeSeverityKey: 'statusBadgeColor',
        align: 'center',
      },
      {
        field: 'actions',
        caption: 'Ações',
        actionButtonsType: 'buttons',
        actionButtons: [
          {
            icon: 'lucideCircleCheckBig',
            label: 'Dar Baixa',
            tooltip: 'Dar Baixa na Conta a Receber',
            variant: 'text',
            action: (rowData: any) => {
              this.markAsReceived(rowData?.id);
            },
          },
          {
            icon: 'lucideSquarePen',
            label: 'Editar',
            tooltip: 'Editar Conta a Receber',
            colorIcon: '#3B82F6',
            variant: 'text',
            action: (rowData: any) => {
              this.edit(rowData?.id);
            },
          },
          {
            icon: 'lucideTrash2',
            label: 'Excluir',
            variant: 'text',
            colorText: '#EF4444',
            colorIcon: '#EF4444',
            tooltip: 'Excluir Conta a Receber',
            action: (rowData: any) => {
              this.delete(rowData?.id);
            },
          },
        ],
      },
    ],
  });

  constructor() {}

  async ngOnInit() {

    this.coreService.setPageTitle(
      'Contas a Receber',
      'Lista de contas a receber'
    );
  }

  async loadAccountsReceivable() {
    await this.state.getAccountsReceivableList(true);
  }

  // Método para dar baixa na conta a receber
  async markAsReceived(id: number) {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja dar baixa nesta conta a receber?',
      header: 'Confirmação de Baixa',
      icon: 'pi pi-exclamation-triangle text-yellow-500',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.accountsReceivableService
          .markAsReceived(id)
          .pipe(takeUntilDestroyed(this.destroyedRef))
          .subscribe({
            next: () => {
              this.toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Conta a receber marcada como recebida com sucesso',
              });
              this.state.updateAccountReceivableStatus(id, 'received');
            },
            error: () => {
              this.toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao dar baixa na conta a receber',
              });
            },
          });
      },
    });
  }

  navigateToKanban() {
    this.router.navigate(['/dashboard/accounts-receivable/kanban']);
  }

  addNewAccount() {
    this.router.navigate([
      { outlets: { drawer: ['accounts-receivable', 'new'] } },
    ]);
  }

  edit(id: string) {
    this.router.navigate(['dashboard/accounts-receivable/edit/', id]);
  }

  delete(id: string) {
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
          .delete(id)
          .pipe(takeUntilDestroyed(this.destroyedRef))
          .subscribe({
            next: () => {
              this.toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Conta a receber excluída com sucesso',
              });
              this.state.removeAccountReceivable(Number(id));
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
