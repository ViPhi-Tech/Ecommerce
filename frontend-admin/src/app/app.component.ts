import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ScheduleNotificationService } from './dashboard/modules/scheduling-module/schedule-notification.service';
import { ScheduleNotificationComponent } from './shared/components/schedule-notification/schedule-notification.component';

@Component({
  selector: 'fuse-root',
  imports: [RouterModule, LoaderComponent, ToastModule, ConfirmDialogModule, ScheduleNotificationComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  private notificationService = inject(ScheduleNotificationService);

  title = 'sellup';

  constructor() {
    const theme = localStorage.getItem('theme');
    if (theme) {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }

  ngOnInit() {
    this.notificationService.start();
  }

  ngOnDestroy() {
    this.notificationService.stop();
  }
}
