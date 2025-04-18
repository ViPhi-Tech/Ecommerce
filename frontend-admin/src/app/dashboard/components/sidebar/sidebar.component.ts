import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleHelp, lucideSettings } from '@ng-icons/lucide';
import { MenuComponent } from './menu/menu.component';

@Component({
  selector: 'fuse-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [NgIcon, MenuComponent],
  viewProviders: [
    provideIcons({
      lucideSettings,
      lucideCircleHelp,
    }),
  ],
})
export class SidebarComponent {}
