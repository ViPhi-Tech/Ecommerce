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

@Component({
  selector: 'fuse-accounts-receivable-list',
  templateUrl: './accounts-receivable-list.component.html',
  animations: [heightAnimation],
  imports: [TableComponent],
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
    headerButtons: [
      {
        icon: 'pi pi-plus',
        label: 'Adicionar',
        tooltip: 'Adicionar Conta a Receber',
        action: () => {
          this.router.navigate([
            { outlets: { drawer: ['accounts-receivable', 'new'] } },
          ]);
        },
      },
    ],
    columns: [
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
      },
      {
        field: 'amount',
        caption: 'Valor',
        type: 'currency',
        sortable: true,
        filter: true,
      },
      {
        field: 'actions',
        caption: 'Ações',
        actionButtonsType: 'buttons',
        actionButtons: [
          {
            icon: 'lucideSquarePen',
            label: 'Editar',
            tooltip: 'Editar Conta a Receber',
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
    await this.state.getAccountsReceivableList();
    console.log(
      'Accounts Receivable List:',
      this.state.accountsReceivableList()
    );

    this.coreService.setPageTitle(
      'Contas a Receber',
      'Lista de contas a receber'
    );
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
