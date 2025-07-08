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
import { TableComponent } from 'app/shared/components/table/table.component';
import { TableConfig } from 'app/shared/interfaces/table.interfaces';
import { TableFilterComponent } from 'app/shared/components/table/components/table-filter/table-filter.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserService } from '../../user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { heightAnimation } from 'app/shared/utils/animations';
import { NgIcon } from '@ng-icons/core';
import { ButtonModule } from 'primeng/button';
import { UserState } from '../../user.state';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'fuse-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  animations: [heightAnimation],
  imports: [
    TableComponent,
    TableFilterComponent,
    ButtonModule,
  ],
})
export class UserListComponent implements OnInit {
  private router = inject(Router);
  private coreService = inject(CoreService);
  private toast = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private userService = inject(UserService);
  protected state = inject(UserState);
  private destroyRef = inject(DestroyRef);

  refreshUserEffect = effect(() => {
    this.userService.refreshUserList$();
    this.state.getUserList();
  });

  tableConfig: WritableSignal<TableConfig> = signal({
    rowsPerPageOptions: [5, 10, 20],
    rowsPerPage: 10,
    paginator: true,
    pageLinkSize: 5,
    columns: [
      { field: 'id', caption: 'ID', sortable: true, filter: true },
      { field: 'fullName', caption: 'Nome', sortable: true, filter: true },
      { field: 'email', caption: 'Email', sortable: true, filter: true },
      { field: 'isActive', caption: 'Ativo', sortable: true, filter: true },
      {
        field: 'actions',
        caption: 'Ações',
        sortable: false,
        filter: false,
        actionButtonsType: 'buttons',
        actionButtons: [
          {
            icon: 'pi pi-pencil',
            tooltip: 'Editar usuário',
            action: (rowData: any) => {
              this.router.navigate([{ outlets: { drawer: ['users', 'edit', rowData.id] } }]);
            },
          },
          {
            icon: 'pi pi-trash',
            tooltip: 'Excluir usuário',
            action: (rowData: any) => {
              this.confirmDelete(rowData);
            },
          },
        ],
      },
    ],
    headerButtons: [
      {
        icon: 'pi pi-plus',
        label: 'Adicionar Usuário',
        tooltip: 'Adicionar Usuário',
        action: () => {
          this.router.navigate([{ outlets: { drawer: ['users', 'new'] } }]);
        },
      },
    ],
  });

  title = 'Lista de Usuários';

  constructor() {
    // this.coreService.setPageTitle(this.title);
  }

  ngOnInit() {
    this.state.getUserList();
  }

  confirmDelete(user: any) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o usuário ${user.fullName}?`,
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.deleteUser(user.id);
      },
    });
  }

  deleteUser(userId: string) {
    this.userService
      .deleteUser(userId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Usuário excluído com sucesso',
          });
          this.state.getUserList();
        },
        error: (error) => {
          this.toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao excluir usuário',
          });
          console.error('Error deleting user:', error);
        },
      });
  }
}
