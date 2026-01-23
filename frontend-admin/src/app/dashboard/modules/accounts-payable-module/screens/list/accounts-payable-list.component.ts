import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from 'app/shared/services/core.service';
import { TableConfig } from 'app/shared/interfaces/table.interfaces';
import { ConfirmationService, MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { heightAnimation } from 'app/shared/utils/animations';
import { TableComponent } from 'app/shared/components/table/table.component';
import { ButtonModule } from 'primeng/button';
import { AccountsPayableService } from '../../accounts-payable.service';
import { AccountsPayableState } from '../../accounts-payable.state';
import { IAccountsPayable } from 'app/shared/interfaces/accounts-payable/AccountsPayable';

@Component({
  selector: 'fuse-accounts-payable-list',
  templateUrl: './accounts-payable-list.component.html',
  animations: [heightAnimation],
  imports: [TableComponent, ButtonModule],
})
export class AccountsPayableListComponent implements OnInit {
  private router = inject(Router);
  private coreService = inject(CoreService);
  private toast = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private accountsPayableService = inject(AccountsPayableService);
  private destroyedRef = inject(DestroyRef);

  state = inject(AccountsPayableState);

  tableConfig = signal<TableConfig>({
    rowsPerPageOptions: [5, 10, 20],
    rowsPerPage: 10,
    paginator: true,
    pageLinkSize: 5,
    columns: [
      // { field: 'id', caption: 'ID', sortable: true, filter: true },
      {
        field: 'supplierName',
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
        filter: true,
        sortable: true,
        type: 'date',
      },
      {
        field: 'amount',
        caption: 'Valor',
        type: 'currency',
        sortable: true,
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
            icon: 'lucideCalendarClock',
            label: 'Marcar como Pendente/Vencido',
            colorIcon: '#FACC15',
            tooltip: 'Marcar como Pendente/Vencido',
            variant: 'text',
            show: (rowData: Signal<IAccountsPayable>) => {
              return rowData().status === 'paid';
            },
            action: (rowData: IAccountsPayable) => {
              this.markAsPendingOrOverdue(rowData?.id);
            },
          },
          {
            icon: 'lucideCircleCheckBig',
            label: 'Dar Baixa',
            tooltip: 'Dar Baixa na Conta a Pagar',
            colorIcon: '#22C55E',
            variant: 'text',
            show: (rowData: Signal<IAccountsPayable>) => {
              return rowData().status !== 'paid';
            },
            action: (rowData: IAccountsPayable) => {
              this.markAsPaid(rowData?.id);
            },
          },
          {
            icon: 'lucideSquarePen',
            label: 'Editar',
            tooltip: 'Editar Conta a Pagar',
            colorIcon: '#3B82F6',
            variant: 'text',
            action: (rowData: IAccountsPayable) => {
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
            action: (rowData: IAccountsPayable) => {
              this.delete(rowData?.id);
            },
          },
        ],
      },
    ],
  });

  constructor() {
  }

  async ngOnInit() {
    // Salvar preferência atual como lista
    localStorage.setItem('accounts-payable-view-preference', 'list');

    this.loadAccountsPayable();
  }

  loadAccountsPayable() {
    this.state.getAccountsPayableList();
  }

  // Método para marcar como pendente/vencido
  async markAsPendingOrOverdue(id: number) {
    this.confirmationService.confirm({
      message:
        'Você tem certeza que deseja marcar como pendente/vencido esta conta a pagar?',
      header: 'Confirmação de Marcação',
      icon: 'pi pi-exclamation-triangle text-yellow-500',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-warning',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.coreService.showLoader();
        this.accountsPayableService
          .updateAccountPayableStatus(id, 'pending', false)
          .pipe(
            takeUntilDestroyed(this.destroyedRef),
            finalize(() => this.coreService.hideLoader())
          )
          .subscribe({
            next: () => {
              this.toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail:
                  'Conta a pagar marcada como pendente/vencido com sucesso',
              });
              this.state.updateAccountPayableStatus(id, 'pending');
            },
            error: () => {
              this.toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao atualizar status da conta a pagar',
              });
            },
          });
      },
    });
  }

  // Método para dar baixa na conta a pagar
  async markAsPaid(id: number) {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja dar baixa nesta conta a pagar?',
      header: 'Confirmação de Baixa',
      icon: 'pi pi-exclamation-triangle text-yellow-500',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.coreService.showLoader();
        this.accountsPayableService
          .updateAccountPayableStatus(id, 'paid', false)
          .pipe(
            takeUntilDestroyed(this.destroyedRef),
            finalize(() => this.coreService.hideLoader())
          )
          .subscribe({
            next: () => {
              this.toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Conta a pagar marcada como paga com sucesso',
              });
              this.state.updateAccountPayableStatus(id, 'paid');
            },
            error: () => {
              this.toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao dar baixa na conta a pagar',
              });
            },
          });
      },
    });
  }

  addNewAccount() {
    this.router.navigate([
      { outlets: { drawer: ['accounts-payable', 'new'] } },
    ]);
  }

  edit(id: number) {
    this.router.navigate([{ outlets: { drawer: ['accounts-payable', id] } }]);
  }

  delete(id: number) {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja excluir esta conta a pagar?',
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle text-red-500',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.coreService.showLoader();
        this.accountsPayableService
          .delete(id)
          .pipe(
            takeUntilDestroyed(this.destroyedRef),
            finalize(() => this.coreService.hideLoader())
          )
          .subscribe({
            next: () => {
              this.toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Conta a pagar excluída com sucesso',
              });
              this.state.removeAccountPayable(id);
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

  navigateToKanban() {
    // Salvar preferência de visualização
    localStorage.setItem('accounts-payable-view-preference', 'kanban');
    this.router.navigate(['/dashboard/accounts-payable/kanban']);
  }
}
