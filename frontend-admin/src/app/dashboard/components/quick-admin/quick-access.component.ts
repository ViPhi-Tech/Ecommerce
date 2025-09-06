import {
  Component,
  inject,
  model,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ROLES_SITEMAP } from 'app/shared/constants/roles.sitemap';
import { AuthService } from 'app/core/auth/auth.service';

interface QuickAccessItem {
  id: string;
  label: string;
  icon: string;
  click: () => void;
}

@Component({
  selector: 'fuse-quick-access',
  templateUrl: './quick-access.component.html',
  styleUrls: ['./quick-access.component.scss'],
  imports: [
    DrawerModule,
    NgIcon,
    InputTextModule,
    InputGroupAddonModule,
    InputGroupModule,
    ReactiveFormsModule,
  ],
})
export class QuickAccessComponent implements OnInit, OnDestroy {
  // Dependencies
  router = inject(Router);
  private authService = inject(AuthService);

  show = signal<boolean>(false);
  title = model<string>('Cadastro rápido');

  searchInput = new FormControl<string>('');

  quickAccessItemsFiltered = signal<QuickAccessItem[]>([]);
  quickAccessItems = signal<QuickAccessItem[]>([
    {
      id: ROLES_SITEMAP.Produtos,
      label: 'Cadastro de Produtos',
      icon: 'lucideBox',
      click: () => {
        this.toggleQuickAccess();
        this.router.navigate([{ outlets: { drawer: ['products', 'new'] } }]);
      },
    },
    {
      id: ROLES_SITEMAP.Categorias,
      label: 'Cadastro de Categorias',
      icon: 'lucideTag',
      click: () => {
        this.toggleQuickAccess();
        this.router.navigate([{ outlets: { drawer: ['categories', 'new'] } }]);
      },
    },
    {
      id: ROLES_SITEMAP.Clientes,
      label: 'Cadastro de Clientes',
      icon: 'lucideUserPlus',
      click: () => {
        this.toggleQuickAccess();
        this.router.navigate([{ outlets: { drawer: ['clients', 'new'] } }]);
      },
    },
    {
      id: ROLES_SITEMAP.Fornecedores,
      label: 'Cadastro de Fornecedores',
      icon: 'lucideUsers',
      click: () => {
        this.toggleQuickAccess();
        this.router.navigate([{ outlets: { drawer: ['suppliers', 'new'] } }]);
      },
    },
    {
      id: ROLES_SITEMAP.ContasPagar,
      label: 'Cadastro de Contas a Pagar',
      icon: 'lucideFileText',
      click: () => {
        this.toggleQuickAccess();
        this.router.navigate([
          { outlets: { drawer: ['accounts-payable', 'new'] } },
        ]);
      },
    },
    {
      id: ROLES_SITEMAP.MovimentacaoEstoque,
      label: 'Entrada de Produtos',
      icon: 'lucidePackagePlus',
      click: () => {
        this.toggleQuickAccess();
        this.router.navigate([{ outlets: { drawer: ['inbound', 'new'] } }]);
      },
    },
    {
      id: ROLES_SITEMAP.MovimentacaoEstoque,
      label: 'Saída de Produtos',
      icon: 'lucidePackageMinus',
      click: () => {
        this.toggleQuickAccess();
        this.router.navigate([{ outlets: { drawer: ['outbound', 'new'] } }]);
      },
    },
    {
      id: ROLES_SITEMAP.Relatorios,
      label: 'Relatórios',
      icon: 'lucideChartBar',
      click: () => {},
    },
    {
      id: ROLES_SITEMAP.Usuarios,
      label: 'Cadastro de Usuários',
      icon: 'lucideUser',
      click: () => {
        this.toggleQuickAccess();
        this.router.navigate([{ outlets: { drawer: ['users', 'new'] } }]);
      },
    },
  ]);

  private _searchSubscription!: Subscription;

  constructor() {}

  ngOnInit() {
    const filteredItems = this.quickAccessItems().filter(item =>
      this.authService.checkAnyRole([item.id])
    );
    this.quickAccessItemsFiltered.set(filteredItems);

    this._searchSubscription = this.searchInput.valueChanges.subscribe(
      (value = '') => {
        this.quickAccessItemsFiltered.set(
          filteredItems.filter(item =>
            item.label.toLowerCase().includes((value ?? '').toLowerCase())
          )
        );
      }
    );
  }

  toggleQuickAccess() {
    this.show.set(!this.show());
  }

  onCloseDrawer() {
    this.show.set(false);
  }

  ngOnDestroy(): void {
    if (this._searchSubscription) {
      this._searchSubscription.unsubscribe();
    }
  }
}
