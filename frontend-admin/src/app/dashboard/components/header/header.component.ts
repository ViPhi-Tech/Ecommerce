import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { Subscription } from 'rxjs';
import { CoreService } from '../../../shared/services/core.service';
import { QuickAccessComponent } from '../quick-admin/quick-access.component';
@Component({
  selector: 'fuse-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [NgIcon, QuickAccessComponent, QuickAccessComponent],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private coreService = inject(CoreService);

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

  toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem(
      'theme',
      document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    );
  }

  ngOnDestroy() {
    this._pageTitleSubscription?.unsubscribe();
  }
}
