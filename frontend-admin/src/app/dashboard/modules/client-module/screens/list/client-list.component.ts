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
import { TableComponent } from 'app/shared/components/table/table.component';
import { TableConfig } from 'app/shared/interfaces/table.interfaces';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ClientService } from '../../client.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ClientState } from '../../client.state';

@Component({
  selector: 'fuse-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss'],
  imports: [TableComponent, ButtonModule, DialogModule, ButtonModule],
})
export class ClientListComponent implements OnInit {
  private toast = inject(MessageService);
  private clientService = inject(ClientService);
  private destroyedRef = inject(DestroyRef);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);
  private coreService = inject(CoreService);
  state = inject(ClientState);

  visible = false;

  tableConfig: WritableSignal<TableConfig> = signal({
    rowsPerPageOptions: [5, 10, 20],
    rowsPerPage: 10,
    paginator: true,
    pageLinkSize: 5,
    headerButtons: [
      {
        icon: 'pi pi-plus',
        label: 'Adicionar',
        tooltip: 'Adicionar Cliente',
        action: () => {
          // Exemplo de navegação para o outlet auxiliar "drawer"
          this.router.navigate([{ outlets: { drawer: ['clients', 'new'] } }]);
        },
      },
    ],
    columns: [
      { field: 'id', caption: 'ID', sortable: true, filter: true },
      {
        field: 'fullName',
        caption: 'Nome Completo',
        sortable: true,
        filter: true,
      },
      { field: 'email', caption: 'Email' },
      { field: 'phone', type: 'phone', caption: 'Telefone' },
      {
        field: 'document',
        type: 'document',
        caption: 'CPF/CNPJ',
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
            tooltip: 'Editar Cliente',
            variant: 'text',
            action: (rowData: any) => {
              // Exemplo de navegação para o outlet auxiliar "drawer"
              this.router.navigate([
                { outlets: { drawer: ['clients', rowData?.id] } },
              ]);
            },
          },
          {
            icon: 'lucideTrash2',
            label: 'Excluir',
            variant: 'text',
            colorText: '#EF4444',
            colorIcon: '#EF4444',
            tooltip: 'Excluir Cliente',
            action: (rowData: any) => {
              this.deleteClient(rowData?.id);
            },
          },
        ],
      },
    ],
  });

  constructor() {}

  ngOnInit() {
    this.state.getClientList();
    this.coreService.setPageTitle('Clientes', 'Lista de clientes cadastrados');
  }

  deleteClient(id: string) {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja excluir este cliente?',
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle text-red-500',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.clientService
          .deleteClient(id)
          .pipe(takeUntilDestroyed(this.destroyedRef))
          .subscribe({
            next: () => {
              this.toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Cliente excluído com sucesso',
              });
              this.state.getClientList();
            },
            error: () => {
              this.toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao excluir cliente',
              });
            },
          });
      },
    });
  }
}
