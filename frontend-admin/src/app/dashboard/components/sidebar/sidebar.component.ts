import { Component, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { MenuComponent } from './menu/menu.component';
import { RouterModule } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'fuse-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [NgIcon, MenuComponent, RouterModule, NgClass],
})
export class SidebarComponent {
  compactMode = signal(false);
}
