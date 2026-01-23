import { Component, inject, signal, effect, OnDestroy } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { MenuComponent } from './menu/menu.component';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { NgClass } from '@angular/common';
import { SidebarService } from '../../../shared/services/sidebar.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'fuse-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [NgIcon, MenuComponent, RouterModule, NgClass],
})
export class SidebarComponent implements OnDestroy {
  private router = inject(Router);
  private sidebarService = inject(SidebarService);
  compactMode = signal(false);
  isOpen = this.sidebarService.isOpen;
  private navigationSubscription: any;

  constructor() {
    // Fechar sidebar ao navegar no mobile
    this.navigationSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (window.innerWidth < 1024) {
          this.sidebarService.close();
        }
      });

    // Prevenir scroll do body quando sidebar estiver aberta no mobile
    effect(() => {
      if (this.isOpen() && window.innerWidth < 1024) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  ngOnDestroy() {
    this.navigationSubscription?.unsubscribe();
    document.body.style.overflow = '';
  }

  onLogoClick() {
    this.router.navigate(['/dashboard']);
    if (window.innerWidth < 1024) {
      this.sidebarService.close();
    }
  }

  closeSidebar() {
    this.sidebarService.close();
  }
}
