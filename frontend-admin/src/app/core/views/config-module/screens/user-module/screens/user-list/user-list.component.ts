import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from 'app/shared/services/core.service';
import { TableComponent } from 'app/shared/components/table/table.component';
import { TableConfig } from 'app/shared/interfaces/table.interfaces';
import { UserService } from '../../user.service';

@Component({
  selector: 'fuse-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  imports: [TableComponent],
})
export class UserListComponent implements OnInit {
  private router = inject(Router);
  private activateRoute = inject(ActivatedRoute);
  private coreService = inject(CoreService);
  private userService = inject(UserService);

  users = signal<unknown[]>([]);
  loading = signal(false);

  tableConfig: WritableSignal<TableConfig> = signal({
    rowsPerPageOptions: [5, 10, 20],
    rowsPerPage: 10,
    paginator: true,
    pageLinkSize: 5,
    columns: [
      { field: 'id', caption: 'ID', sortable: true, filter: true },
      { field: 'name', caption: 'Nome', sortable: true, filter: true },
      { field: 'email', caption: 'Email', sortable: true, filter: true },
      { field: 'role', caption: 'Permissão', sortable: true, filter: true },
    ],
    headerButtons: [
      {
        icon: 'pi pi-plus',
        label: 'Adicionar Produto',
        tooltip: 'Adicionar Produto',
        action: () => {
          // Exemplo de navegação para o outlet auxiliar "drawer"
          this.router.navigate([{ outlets: { drawer: ['users', 'new'] } }]);
        },
      },
    ],
  });

  title = '';

  constructor() {}

  ngOnInit() {
    this.getUsersList();
  }

  getUsersList() {
    this.loading.set(true);
    this.userService.getUsersList().subscribe({
      next: response => {
        this.users.set(response);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
