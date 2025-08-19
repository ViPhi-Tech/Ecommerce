import { Component, inject, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { MenuComponent } from './menu/menu.component';
import { Router, RouterModule } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'fuse-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [NgIcon, MenuComponent, RouterModule, NgClass],
})
export class SidebarComponent {
  private router = inject(Router);
  compactMode = signal(false);

  onLogoClick() {
    this.router.navigate(['/dashboard']);
  }
}
