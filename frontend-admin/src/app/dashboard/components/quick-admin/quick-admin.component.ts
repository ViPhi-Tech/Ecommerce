import { Component, model, OnInit, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBadgePlus } from '@ng-icons/lucide';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'fuse-quick-admin',
  templateUrl: './quick-admin.component.html',
  styleUrls: ['./quick-admin.component.scss'],
  imports: [DrawerModule, NgIcon],
  viewProviders: [
    provideIcons({ lucideBadgePlus }),
  ],
})
export class QuickAdminComponent implements OnInit {
  show = signal<boolean>(false);
  title = model<string>('Cadastros Rápidos');

  constructor() { }

  ngOnInit() {
  }

  toggleQuickAdmin() {
    this.show.set(!this.show());
  }

  onCloseDrawer() {
    this.show.set(false);
  }

}
