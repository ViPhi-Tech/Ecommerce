import { Component, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ScheduleNotificationService } from '../../../dashboard/modules/scheduling-module/schedule-notification.service';
import dayjs from 'dayjs';

@Component({
  selector: 'fuse-schedule-notification',
  imports: [DialogModule, ButtonModule],
  templateUrl: './schedule-notification.component.html',
  styleUrl: './schedule-notification.component.scss',
})
export class ScheduleNotificationComponent {
  readonly notificationService = inject(ScheduleNotificationService);

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
