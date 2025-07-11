import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from 'app/shared/services/core.service';
import { TableConfig } from 'app/shared/interfaces/table.interfaces';
import { ConfirmationService, MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { heightAnimation } from 'app/shared/utils/animations';
import { TableComponent } from 'app/shared/components/table/table.component';
import { AccountsPayableService } from '../../accounts-payable.service';
import { AccountsPayableState } from '../../accounts-payable.state';

@Component({
  selector: 'fuse-accounts-payable-list',
  templateUrl: './accounts-payable-list.component.html',
  animations: [heightAnimation],
  imports: [TableComponent],
})
export class AccountsPayableListComponent implements OnInit {
  private router = inject(Router);
  private coreService = inject(CoreService);
  private toast = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private accountsPayableService = inject(AccountsPayableService);
  private destroyedRef = inject(DestroyRef);

  state = inject(AccountsPayableState);

  tableConfig: WritableSignal<TableConfig> = signal({
    rowsPerPageOptions: [5, 10, 20],
    rowsPerPage: 10,
    paginator: true,
    pageLinkSize: 5,
    headerButtons: [
      {
        icon: 'pi pi-plus',
        label: 'Adicionar',
        tooltip: 'Adicionar Conta a Pagar',
        action: () => {
          this.router.navigate([
            { outlets: { drawer: ['accounts-payable', 'new'] } },
          ]);
        },
      },
    ],
    columns: [
      // { field: 'id', caption: 'ID', sortable: true, filter: true },
      {
        field: 'provider',
        caption: 'Fornecedor',
        sortable: true,
        filter: true,
      },
      {
        field: 'description',
        caption: 'Descrição',
      },
      {
        field: 'dueDate',
        caption: 'Data de Vencimento',
        sortable: true,
      },
      {
        field: 'amount',
        caption: 'Valor',
        type: 'currency',
        sortable: true,
      },
      {
        field: 'actions',
        caption: 'Ações',
        actionButtonsType: 'buttons',
        actionButtons: [
          {
            icon: 'lucideSquarePen',
            label: 'Editar',
            tooltip: 'Editar Conta a Pagar',
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
            tooltip: 'Excluir Conta a Pagar',
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
    await this.state.getAccountsPayableList();
    console.log('Accounts Payable List:', this.state.accountsPayableList());

    this.coreService.setPageTitle('Contas a Pagar', 'Lista de contas a pagar');
  }

  edit(id: string) {
    this.router.navigate(['dashboard/accounts-payable/edit/', id]);
  }

  delete(id: string) {
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
          .delete(id)
          .pipe(takeUntilDestroyed(this.destroyedRef))
          .subscribe({
            next: () => {
              this.toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Conta a pagar excluída com sucesso',
              });
              this.accountsPayableService.refreshList();
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
