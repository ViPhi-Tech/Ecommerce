import { inject, Injectable, NgZone, OnDestroy } from '@angular/core';
import { ToastService } from 'app/shared/services/toast.service';
import { SchedulingService, ScheduleEntity } from './scheduling.service';
import dayjs from 'dayjs';

interface NotifiedEntry {
  id: number;
  type: 'reminder' | 'now';
}

@Injectable({
  providedIn: 'root',
})
export class ScheduleNotificationService implements OnDestroy {
  private toast = inject(ToastService);
  private schedulingService = inject(SchedulingService);
  private ngZone = inject(NgZone);

  private intervalId: ReturnType<typeof setInterval> | null = null;
  private notified = new Set<string>();
  private permissionGranted = false;
  private running = false;

  private static readonly CHECK_INTERVAL_MS = 30_000;
  private static readonly REMINDER_MINUTES = 5;
  private static readonly STORAGE_KEY = 'schedule-notified-ids';

  start(): void {
    if (this.running) return;
    this.running = true;
    this.loadNotifiedFromStorage();
    this.requestPermission();

    this.ngZone.runOutsideAngular(() => {
      this.checkUpcoming();
      this.intervalId = setInterval(
        () => this.checkUpcoming(),
        ScheduleNotificationService.CHECK_INTERVAL_MS,
      );
    });
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.running = false;
  }

  ngOnDestroy(): void {
    this.stop();
  }

  private requestPermission(): void {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      this.permissionGranted = true;
      return;
    }

    if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((perm) => {
        this.permissionGranted = perm === 'granted';
      });
    }
  }

  private checkUpcoming(): void {
    this.schedulingService.getAll(true).subscribe({
      next: (res) => {
        const schedules = (res.data ?? res.dados ?? []) as ScheduleEntity[];
        this.evaluateSchedules(schedules);
      },
    });
  }

  private evaluateSchedules(schedules: ScheduleEntity[]): void {
    const now = dayjs();

    for (const schedule of schedules) {
      if (schedule.status !== 'SCHEDULED') continue;

      const start = dayjs(schedule.startDateTime);
      const diffMinutes = start.diff(now, 'minute', true);

      const reminderKey = this.buildKey(schedule.id, 'reminder');
      if (
        diffMinutes > 0 &&
        diffMinutes <= ScheduleNotificationService.REMINDER_MINUTES &&
        !this.notified.has(reminderKey)
      ) {
        const minutes = Math.ceil(diffMinutes);
        this.notify(
          `${schedule.title} começa em ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`,
          schedule,
          'reminder',
        );
      }

      const nowKey = this.buildKey(schedule.id, 'now');
      if (diffMinutes <= 0 && diffMinutes > -1 && !this.notified.has(nowKey)) {
        this.notify(`${schedule.title} está começando agora!`, schedule, 'now');
      }
    }
  }

  private notify(message: string, schedule: ScheduleEntity, type: 'reminder' | 'now'): void {
    const key = this.buildKey(schedule.id, type);
    this.notified.add(key);
    this.saveNotifiedToStorage();

    this.ngZone.run(() => {
      this.toast.info(message);
    });

    if (this.permissionGranted) {
      const startFormatted = dayjs(schedule.startDateTime).format('HH:mm');
      new Notification('Agendamento', {
        body: `${message}\nHorário: ${startFormatted}`,
        icon: '/assets/icons/icon-128x128.png',
        tag: key,
      });
    }
  }

  private buildKey(id: number, type: string): string {
    const today = dayjs().format('YYYY-MM-DD');
    return `${today}_${id}_${type}`;
  }

  private loadNotifiedFromStorage(): void {
    try {
      const stored = localStorage.getItem(ScheduleNotificationService.STORAGE_KEY);
      if (!stored) return;

      const parsed = JSON.parse(stored) as { date: string; keys: string[] };
      const today = dayjs().format('YYYY-MM-DD');

      if (parsed.date === today) {
        this.notified = new Set(parsed.keys);
      } else {
        localStorage.removeItem(ScheduleNotificationService.STORAGE_KEY);
      }
    } catch {
      localStorage.removeItem(ScheduleNotificationService.STORAGE_KEY);
    }
  }

  private saveNotifiedToStorage(): void {
    const payload = {
      date: dayjs().format('YYYY-MM-DD'),
      keys: Array.from(this.notified),
    };
    localStorage.setItem(ScheduleNotificationService.STORAGE_KEY, JSON.stringify(payload));
  }
}
