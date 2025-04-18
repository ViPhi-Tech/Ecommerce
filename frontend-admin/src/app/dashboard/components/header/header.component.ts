import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideMoon,
  lucideSun,
  lucideBell,
  lucideChevronRight,
} from '@ng-icons/lucide';
import { Subscription } from 'rxjs';
import { CoreService } from '../../../shared/services/core.service';
@Component({
  selector: 'fuse-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [NgIcon],
  viewProviders: [
    provideIcons({ lucideSun, lucideMoon, lucideBell, lucideChevronRight }),
  ],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private coreService = inject(CoreService);

  breadcrumb: string[] = [];

  _breadcrumbSubscrition!: Subscription;

  constructor() {}

  ngOnInit() {
    this._breadcrumbSubscrition = this.coreService.breadcrumb$.subscribe(
      (breadcrumb: string[]) => {
        this.breadcrumb = breadcrumb;
      }
    );
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
