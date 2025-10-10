import {
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from 'app/shared/services/core.service';
import { TableComponent } from 'app/shared/components/table/table.component';
import { TableConfig } from 'app/shared/interfaces/table.interfaces';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DebtService } from '../../debt.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { heightAnimation } from 'app/shared/utils/animations';
import { NgIcon } from '@ng-icons/core';
import { ButtonModule } from 'primeng/button';
import { DebtState } from '../../debt.state';
import { FormsModule } from '@angular/forms';
import { Tooltip } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { IDebt } from 'app/shared/interfaces/debt/Debt';
import PeriodComponent, {
  PeriodRange,
} from 'app/shared/components/period/period.component';
import { CurrencyPipe } from '@angular/common';
import { ClientState } from '../../../client-module/client.state';
import { SelectModule } from 'primeng/select';
import { AccountsReceivableState } from 'app/dashboard/modules/accounts-receivable-module/accounts-receivable.state';

@Component({
  selector: 'fuse-debt-list',
  templateUrl: './debt-list.component.html',
  styleUrls: ['./debt-list.component.scss'],
  animations: [heightAnimation],
  imports: [
    TableComponent,
    NgIcon,
    ButtonModule,
    Tooltip,
    TagModule,
    FormsModule,
    PeriodComponent,
    CurrencyPipe,
    SelectModule,
  ],
})
export class DebtListComponent implements OnInit {
  private router = inject(Router);
  private coreService = inject(CoreService);
  private toast = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private debtService = inject(DebtService);
  private destroyedRef = inject(DestroyRef);

  state = inject(DebtState);
  clientState = inject(ClientState);
  accountsReceivableState = inject(AccountsReceivableState);

  tableConfig = signal<TableConfig>({
    rowsPerPageOptions: [5, 10, 20],
    rowsPerPage: 10,
    paginator: true,
    pageLinkSize: 5,
    selection: {
      mode: 'multiple',
    },
    columns: [
      { field: 'id', caption: 'ID', sortable: true, filter: true },
      {
        field: 'client.fullName',
        caption: 'Cliente',
        sortable: true,
        filter: true,
      },
      {
        field: 'total',
        caption: 'Valor Total',
        type: 'currency',
        sortable: true,
        filter: true,
      },
      {
        field: 'payments',
        caption: 'Pagamentos',
        sortable: false,
        filter: false,
      },
      {
        field: 'createdAt',
        caption: 'Data do Pedido',
        type: 'date',
        sortable: true,
        filter: true,
      },
      {
        field: 'status',
        caption: 'Status',
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
            tooltip: 'Editar Pedido',
            variant: 'text',
            action: (rowData: any) => {
              this.editDebt(rowData?.id);
            },
          },
          {
            icon: 'lucideTrash2',
            label: 'Excluir',
            variant: 'text',
            colorText: '#EF4444',
            colorIcon: '#EF4444',
            tooltip: 'Excluir Pedido',
            action: (rowData: any) => {
              this.deleteDebt(rowData?.id);
            },
          },
        ],
      },
    ],
  });

  statusOptions = signal([
    { label: 'Todos', value: 'all' },
    { label: 'Pendente', value: 'PENDING' },
    { label: 'Pago', value: 'PAID' },
    { label: 'Cancelado', value: 'CANCELLED' },
  ]);

  selectedClient = signal<string | null>(null);

  // Computed para lista de clientes no formato do dropdown
  clientOptions = computed(() => {
    const clients = this.clientState.clientList();
    return [
      { label: 'Todos os clientes', value: null },
      ...clients.map(client => ({
        label: client.fullName || client.document || 'Cliente sem nome',
        value: client.fullName || client.document || '',
      })),
    ];
  });

  // Computed para filtrar pedidos por cliente
  filteredDebtList = computed(() => {
    const debts = this.state.debtList();
    const selectedClient = this.selectedClient();

    if (!selectedClient) {
      return debts;
    }

    return debts.filter(debt => debt.client?.fullName === selectedClient);
  });

  selectedData = signal<IDebt[]>([]);

  // Computed para o sumário dos itens selecionados
  selectedSummary = computed(() => {
    const selected = this.selectedData();
    const count = selected.length;
    const totalAmount = selected.reduce(
      (sum, debt) => sum + (debt.total || 0),
      0
    );
    const pendingCount = selected.filter(d => d.status === 'PENDING').length;
    const paidCount = selected.filter(d => d.status === 'PAID').length;
    const cancelledCount = selected.filter(d => d.status === 'CANCELLED').length;

    return {
      count,
      totalAmount,
      pendingCount,
      paidCount,
      cancelledCount,
    };
  });

  constructor() {
    effect(() => {
      if (this.debtService.refreshDebtList$()) {
        this.state.getDebtList();
      }
    });
  }

  ngOnInit() {
    this.state.getDebtList();
    this.clientState.getClientList();
    this.coreService.setPageTitle(
      'Pedidos Pendentes',
      'Gestão de pedidos com pagamentos pendentes'
    );
  }

  onClientChange(clientName: string | null) {
    this.selectedClient.set(clientName);
  }

  addNewDebt() {
    this.router.navigate([{ outlets: { drawer: ['debts', 'new'] } }]);
  }

  refreshDebts() {
    this.state.getDebtList();
  }

  editDebt(debtId: string) {
    this.router.navigate([{ outlets: { drawer: ['debts', debtId] } }]);
  }

  deleteDebt(debtId: string) {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja excluir esta dívida?',
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle text-red-500',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.debtService
          .deleteDebt(debtId)
          .pipe(takeUntilDestroyed(this.destroyedRef))
          .subscribe({
            next: () => {
              this.toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Dívida excluída com sucesso',
              });
            },
            error: () => {
              this.toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao excluir dívida',
              });
            },
          });
      },
    });
  }

  getStatusSeverity(status: string): 'success' | 'warn' | 'danger' | 'info' {
    switch (status) {
      case 'PAID':
        return 'success';
      case 'PENDING':
        return 'info';
      case 'CANCELLED':
        return 'warn';
      default:
        return 'info';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PAID':
        return 'Pago';
      case 'PENDING':
        return 'Pendente';
      case 'CANCELLED':
        return 'Cancelado';
      default:
        return status;
    }
  }

  onPeriodChange(range: PeriodRange) {
    console.log('Período selecionado:', range);
    console.log('Data inicial:', range.startDate);
    console.log('Data final:', range.endDate);
    console.log('Tipo:', range.periodType);

    // Aqui você pode filtrar a lista de dívidas pelo período
    // Exemplo: this.state.getDebtList(range.startDate, range.endDate);
  }

  convertToAccountsReceivable() {
    const selected = this.selectedData();
    
    if (selected.length === 0) {
      this.toast.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione pelo menos um pedido para converter',
      });
      return;
    }

    // Verifica se todos os pedidos selecionados têm cliente
    const hasNoClient = selected.some(debt => !debt.client);
    if (hasNoClient) {
      this.toast.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Todos os pedidos devem ter um cliente associado para converter',
      });
      return;
    }

    const firstClient = selected[0]?.client?.id;

    // Calcula o total de contas a receber dos pagamentos do tipo 'account-receivable'
    const accountReceivableTotal = this.selectedSummary().totalAmount;

    // Armazena temporariamente os dados para serem usados no modal
    const formData = {
      orders: selected,
      amount: accountReceivableTotal,
      clientId: firstClient,
    };

    this.router.navigate([{ outlets: { drawer: ['accounts-receivable', 'new'] } }]);
    setTimeout(() => {
      this.accountsReceivableState.prefillForm(formData);
    }, 100);
  }
}
