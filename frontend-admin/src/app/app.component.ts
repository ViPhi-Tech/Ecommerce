import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ScheduleNotificationService } from './dashboard/modules/scheduling-module/schedule-notification.service';
import dayjs from 'dayjs';

@Component({
  selector: 'fuse-root',
  imports: [RouterModule, LoaderComponent, ToastModule, ConfirmDialogModule, DialogModule, ButtonModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  readonly notificationService = inject(ScheduleNotificationService);

  title = 'sellup';

  constructor() {
    // Check if the theme is set in localStorage and apply it
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

  getCurrentScheduleTime(): string {
    const schedule = this.notificationService.currentNotification();
    if (!schedule) return '';
    return dayjs(schedule.startDateTime).format('DD/MM/YYYY HH:mm');
  }

  getScheduleTimeRange(): string {
    const schedule = this.notificationService.currentNotification();
    if (!schedule) return '';

    const start = dayjs(schedule.startDateTime);
    const end = dayjs(schedule.endDateTime);

    if (!end.isValid() || end.isSame(start)) {
      return start.format('HH:mm');
    }

    return `${start.format('HH:mm')} - ${end.format('HH:mm')}`;
  }

  getStartsInLabel(): string | null {
    const schedule = this.notificationService.currentNotification();
    if (!schedule) return null;

    const diffMinutes = dayjs(schedule.startDateTime).diff(dayjs(), 'minute');
    if (diffMinutes <= 0) return null;

    return `Em ${diffMinutes} ${diffMinutes === 1 ? 'minuto' : 'minutos'}`;
  }
}
