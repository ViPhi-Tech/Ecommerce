import {
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from 'app/shared/services/core.service';
import { TableConfig } from 'app/shared/interfaces/table.interfaces';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BaseService } from '../../base.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { heightAnimation } from 'app/shared/utils/animations';
import { BaseState } from '../../base.state';

@Component({
  selector: 'fuse-base-list',
  templateUrl: './base-list.component.html',
  styleUrls: ['./base-list.component.scss'],
  animations: [heightAnimation],
  standalone: false,
})
export class BaseListComponent implements OnInit {
  private router = inject(Router);
  private coreService = inject(CoreService);
  private toast = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private baseService = inject(BaseService);
  private destroyedRef = inject(DestroyRef);

  state = inject(BaseState);

  tableConfig: WritableSignal<TableConfig> = signal({
    rowsPerPageOptions: [5, 10, 20],
    rowsPerPage: 10,
    paginator: true,
    pageLinkSize: 5,
    headerButtons: [
      {
        icon: 'pi pi-plus',
        label: 'Adicionar',
        tooltip: 'Adicionar Base',
        action: () => {
          // Exemplo de navegação para o outlet auxiliar "drawer"
          this.router.navigate(['dashboard/bases/new']);
        },
      },
    ],
    columns: [
      { field: 'id', caption: 'ID', sortable: true, filter: true },
      { field: 'name', caption: 'Nome', sortable: true, filter: true },
      {
        field: 'initialPrice',
        caption: 'Preço de Custo',
        type: 'currency',
        sortable: true,
        filter: true,
      },
      {
        field: 'finalPrice',
        caption: 'Preço de Venda',
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
            tooltip: 'Editar Base',
            variant: 'text',
            action: (rowData: any) => {
              this.editBase(rowData?.id);
            },
          },
          {
            icon: 'lucideTrash2',
            label: 'Excluir',
            variant: 'text',
            colorText: '#EF4444',
            colorIcon: '#EF4444',
            tooltip: 'Excluir Base',
            action: (rowData: any) => {
              this.deleteBase(rowData?.id);
            },
          },
        ],
      },
    ],
  });

  title = '';

  categorias = signal([
    { label: 'Dinheiro', value: 'money' },
    { label: 'Cartão de Crédito', value: 'credit_card' },
    { label: 'Cartão de Débito', value: 'debit_card' },
    { label: 'Transferência', value: 'transfer' },
    { label: 'Boleto', value: 'boleto' },
    { label: 'Pix', value: 'pix' },
    { label: 'Cheque', value: 'check' },
    { label: 'Vale', value: 'voucher' },
  ]);
  constructor() {
    effect(() => {
      if (this.baseService.refreshBaseList$()) {
        this.state.getBaseList();
      }
    });
  }

  ngOnInit() {
    this.state.getBaseList();
    this.coreService.setPageTitle('Bases', 'Lista de bases disponíveis');
  }

  editBase(baseId: string) {
    this.router.navigate([
      'dashboard/bases/edit/',
      baseId,
    ]);
  }

  deleteBase(baseId: string) {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja excluir este base?',
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle text-red-500',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.baseService
          .deleteBase(baseId)
          .pipe(takeUntilDestroyed(this.destroyedRef))
          .subscribe({
            next: () => {
              this.toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Base excluído com sucesso',
              });
              this.baseService.refreshBaseList();
            },
            error: () => {
              this.toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao excluir base',
              });
            },
          });
      },
    });
  }
}
