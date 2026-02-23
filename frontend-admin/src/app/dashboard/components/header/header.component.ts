import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { Subscription } from 'rxjs';
import { CoreService } from '../../../shared/services/core.service';
import { QuickAccessComponent } from '../quick-admin/quick-access.component';
import { PopoverModule } from 'primeng/popover';
import { Router } from '@angular/router';
import { SidebarService } from '../../../shared/services/sidebar.service';
import { SettingsModalComponent } from '../settings-modal/settings-modal.component';
import { SettingsModalService } from '../settings-modal/settings-modal.service';

@Component({
  selector: 'fuse-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [NgIcon, QuickAccessComponent, PopoverModule, SettingsModalComponent],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private coreService = inject(CoreService);
  private router = inject(Router);
  private sidebarService = inject(SidebarService);
  settingsModal = inject(SettingsModalService);

  pageTitle = signal({
    title: '',
    subTitle: '',
  });
  showAdmin = signal<boolean>(false);

  _pageTitleSubscription: Subscription | undefined;

  constructor() {}

  ngOnInit() {
    this._pageTitleSubscription = this.coreService.pageTitle$.subscribe(
      (pageTitle: { title: string; subTitle: string }) => {
        this.pageTitle.set(pageTitle);
      }
    );
  }

  toggleQuickAccess() {
    this.showAdmin.set(!this.showAdmin());
  }

  toggleSidebar() {
    this.sidebarService.toggle();
  }

  toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem(
      'theme',
      document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    );
  }

  logout() {
    localStorage.removeItem('accessToken');
    this.router.navigate(['/auth/login']);
  }

  ngOnDestroy() {
    this._pageTitleSubscription?.unsubscribe();
  }
}
