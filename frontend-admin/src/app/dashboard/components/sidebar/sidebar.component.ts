import { Component } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { MenuComponent } from './menu/menu.component';

@Component({
  selector: 'fuse-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [NgIcon, MenuComponent],
})
export class SidebarComponent {}
