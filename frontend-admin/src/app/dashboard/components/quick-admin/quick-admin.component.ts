import { Component, model, OnInit, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
@Component({
  selector: 'fuse-quick-admin',
  templateUrl: './quick-admin.component.html',
  styleUrls: ['./quick-admin.component.scss'],
  imports: [
    DrawerModule,
    NgIcon,
    InputTextModule,
    InputGroupAddonModule,
    InputGroupModule,
  ],
})
export class QuickAdminComponent implements OnInit {
  show = signal<boolean>(false);
  title = model<string>('Cadastro rápido');

  constructor() {}

  ngOnInit() {}

  toggleQuickAdmin() {
    this.show.set(!this.show());
  }

  onCloseDrawer() {
    this.show.set(false);
  }
}
