import { Component, model, OnInit, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

interface QuickAccessItem {
  label: string;
  icon: string;
  link: string;
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
  ],
})
export class QuickAccessComponent implements OnInit {
  show = signal<boolean>(false);
  title = model<string>('Cadastro rápido');

  quickAccessItems = signal<QuickAccessItem[]>([
    { label: 'Cadastro de Produtos', icon: 'lucideBox', link: '/cadastros/produtos' },
    { label: 'Importação de Nota Fiscal', icon: 'lucideFileText', link: '/importacao/nota-fiscal' },
    { label: 'Cadastro de Clientes', icon: 'lucideUser', link: '/cadastros/clientes' },
    { label: 'Cadastro de Fornecedores', icon: 'lucideUsers', link: '/cadastros/fornecedores' },
    { label: 'Relatórios', icon: 'lucideChartBar', link: '/relatorios' },
    { label: 'Configurações', icon: 'lucideSettings', link: '/configuracoes' },
  ]);

  constructor() {}

  ngOnInit() {}

  toggleQuickAccess() {
    this.show.set(!this.show());
  }

  onCloseDrawer() {
    this.show.set(false);
  }
}
