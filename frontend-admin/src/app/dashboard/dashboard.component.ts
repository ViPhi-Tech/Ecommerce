import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { routeAnimations } from 'app/shared/utils/animations';
import { ScheduleNotificationService } from './modules/scheduling-module/schedule-notification.service';
@Component({
  selector: 'fuse-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [routeAnimations],
  standalone: false,
})
export class DashboardComponent implements OnInit, OnDestroy {
  public notificationService = inject(ScheduleNotificationService);
  title = '';

  constructor() {}

  ngOnInit() {
    this.notificationService.start();
  }

  ngOnDestroy() {
    this.notificationService.stop();
  }

  prepareRoute(outlet: RouterOutlet | null) {
    if (!outlet || !outlet.isActivated) {
      return 'none';
    }
    return outlet.activatedRoute.snapshot.data['animation'] || 'none';
  }
}
