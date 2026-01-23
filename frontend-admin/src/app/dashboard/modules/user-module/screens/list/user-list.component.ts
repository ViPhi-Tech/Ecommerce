import {
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
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
import { ButtonModule } from 'primeng/button';
import { UserState } from '../../user.state';
import { SYSTEM_MODULES } from 'app/shared/constants/system-modules.constants';

@Component({
  selector: 'fuse-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  animations: [heightAnimation],
  imports: [TableComponent, TableFilterComponent, ButtonModule],
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

  tableConfig = signal<TableConfig>({
    rowsPerPageOptions: [5, 10, 20],
    rowsPerPage: 10,
    paginator: true,
    pageLinkSize: 5,
    columns: [
      { field: 'id', caption: 'ID', sortable: true, filter: true },
      { field: 'fullName', caption: 'Nome', sortable: true, filter: true },
      { field: 'email', caption: 'Email', sortable: true, filter: true },
      { field: 'isActive', caption: 'Ativo', sortable: true, filter: true, type: 'activeOrNot' },
      {
        field: 'actions',
        caption: 'Ações',
        sortable: false,
        filter: false,
        actionButtonsType: 'buttons',
        actionButtons: [
          {
            icon: 'lucideEdit',
            color: 'info',
            variant: 'text',
            tooltip: 'Editar usuário',
            action: (rowData: any) => {
              this.router.navigate([
                { outlets: { drawer: ['users', 'edit', rowData.id] } },
              ]);
            },
          },
          {
            icon: 'lucideInfo',
            variant: 'text',
            tooltip: 'Ver módulos do usuário',
            action: (rowData: any) => {
              this.showUserModules(rowData);
            },
          },
          {
            icon: 'lucideTrash2',
            variant: 'text',
            tooltip: 'Excluir usuário',
            action: (rowData: any) => {
              this.confirmDelete(rowData);
            },
          },
        ],
      },
    ],
    headerButtons: [],
  });

  title = 'Usuários';

  constructor() {
    this.coreService.setPageTitle(this.title, 'Listagem com os usuários');
  }

  ngOnInit() {
    this.loadUsers();
  }

  addNewUser() {
    this.router.navigate([{ outlets: { drawer: ['users', 'new'] } }]);
  }
  loadUsers() {
    this.state.getUserList();
  }

  refreshUsers() {
    this.loadUsers();
  }

  showUserModules(user: any) {
    const userModules = user.modules || [];
    const moduleNames = userModules.map((moduleId: string) => {
      const module = SYSTEM_MODULES.find(m => m.id === moduleId);
      return module ? module.name : moduleId;
    });

    const modulesText =
      moduleNames.length > 0
        ? moduleNames.join(', ')
        : 'Nenhum módulo atribuído';

    this.confirmationService.confirm({
      message: `<strong>Módulos do usuário ${user.fullName}:</strong><br><br>${modulesText}`,
      header: 'Módulos Permitidos',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Fechar',
      rejectVisible: false,
      accept: () => {},
    });
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
          this.loadUsers();
        },
        error: error => {
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
