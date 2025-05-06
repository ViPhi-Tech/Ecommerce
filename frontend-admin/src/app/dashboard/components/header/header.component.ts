import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { Subscription } from 'rxjs';
import { CoreService } from '../../../shared/services/core.service';
import { QuickAdminComponent } from '../quick-admin/quick-admin.component';
@Component({
  selector: 'fuse-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [NgIcon, QuickAdminComponent, QuickAdminComponent],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private coreService = inject(CoreService);

  breadcrumb: string[] = [];
  showAdmin = signal<boolean>(false);

  _breadcrumbSubscrition!: Subscription;

  constructor() {}

  ngOnInit() {
    this._breadcrumbSubscrition = this.coreService.breadcrumb$.subscribe(
      (breadcrumb: string[]) => {
        this.breadcrumb = breadcrumb;
      }
    );
  }

  toggleQuickAdmin() {
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
    if (this._breadcrumbSubscrition) {
      this._breadcrumbSubscrition.unsubscribe();
    }
  }
}
