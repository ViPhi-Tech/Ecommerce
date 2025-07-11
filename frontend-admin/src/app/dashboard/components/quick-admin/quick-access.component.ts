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

interface QuickAccessItem {
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

  show = signal<boolean>(false);
  title = model<string>('Cadastro rápido');

  searchInput = new FormControl<string>('');

  quickAccessItemsFiltered = signal<QuickAccessItem[]>([]);
  quickAccessItems = signal<QuickAccessItem[]>([
    {
      label: 'Cadastro de Produtos',
      icon: 'lucideBox',
      click: () => {
        this.toggleQuickAccess();
        this.router.navigate([{ outlets: { drawer: ['products', 'new'] } }]);
      },
    },
    {
      label: 'Importação de Nota Fiscal',
      icon: 'lucideFileText',
      click: () => {
        this.toggleQuickAccess();
        this.router.navigate([{ outlets: { drawer: ['import', 'invoice'] } }]);
      },
    },
    // contas a pagar
    {
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
      label: 'Entrada de Produtos',
      icon: 'lucidePackagePlus',
      click: () => {
        this.toggleQuickAccess();
        this.router.navigate([{ outlets: { drawer: ['inbound', 'new'] } }]);
      },
    },
    {
      label: 'Saída de Produtos',
      icon: 'lucidePackageMinus',
      click: () => {
        this.toggleQuickAccess();
        this.router.navigate([{ outlets: { drawer: ['outbound', 'new'] } }]);
      },
    },
    {
      label: 'Cadastro de Clientes',
      icon: 'lucideUser',
      click: () => {},
    },
    {
      label: 'Cadastro de Fornecedores',
      icon: 'lucideUsers',
      click: () => {},
    },
    {
      label: 'Relatórios',
      icon: 'lucideChartBar',
      click: () => {},
    },
    {
      label: 'Configurações',
      icon: 'lucideSettings',
      click: () => {},
    },
  ]);

  private _searchSubscription!: Subscription;

  constructor() {}

  ngOnInit() {
    this.quickAccessItemsFiltered.set(this.quickAccessItems());

    this._searchSubscription = this.searchInput.valueChanges.subscribe(
      (value = '') => {
        this.quickAccessItemsFiltered.set(
          this.quickAccessItems().filter(item =>
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
