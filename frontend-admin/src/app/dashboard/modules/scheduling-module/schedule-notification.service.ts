import { DestroyRef, inject, Injectable, OnDestroy, signal } from '@angular/core';
import { SchedulingService, ScheduleEntity } from './scheduling.service';
import dayjs from 'dayjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface StoredScheduleNotification {
  id: number;
  title: string;
  startDateTime: string;
}

interface ScheduleNotificationStorage {
  savedAt: string;
  schedules: StoredScheduleNotification[];
}

@Injectable({
  providedIn: 'root',
})
export class ScheduleNotificationService implements OnDestroy {
  private schedulingService = inject(SchedulingService);
  private destroyedRef = inject(DestroyRef);

  private startNotificationTimeouts = new Map<number, ReturnType<typeof setTimeout>>();
  private modalQueue: ScheduleEntity[] = [];
  private notifiedIds = new Set<number>();

  storedNotificationIds = signal<number[]>([]);

  notificationModalVisible = signal(false);
  currentNotification = signal<ScheduleEntity | null>(null);

  private static readonly STORAGE_KEY = 'schedule-notified-ids';

  start(): void {
    this.scheduleFromStorageIfValid();
    this.getTodaySchedules();
  }

  stop(): void {
    this.clearStartNotificationTimeouts();
  }

  ngOnDestroy(): void {
    this.stop();
  }

  getTodaySchedules() {
    this.schedulingService.getAll(true).pipe(takeUntilDestroyed(this.destroyedRef)).subscribe({
      next: (res) => {
        const schedules = ((res.data ?? res.dados ?? []) as ScheduleEntity[]).filter((s) =>
          dayjs(s.startDateTime).isSame(dayjs(), 'day'),
        );
        this.prepareStartNotifications(schedules);
      },
      error: (err) => {
        console.error('Erro ao carregar agendamentos de hoje:', err);
      },
    });
  }

  private prepareStartNotifications(schedules: ScheduleEntity[]): void {
    this.clearStartNotificationTimeouts();
    this.saveSchedulesToStorage(schedules);

    const now = dayjs();
    for (const schedule of schedules) {
      if (schedule.status !== 'SCHEDULED') continue;

      const start = dayjs(schedule.startDateTime);
      const millisecondsUntilStart = start.diff(now);

      if (millisecondsUntilStart <= 0) {
        if (!this.storedNotificationIds().includes(schedule.id)) {
          this.notify(`${schedule.title} está começando agora!`, schedule);
          this.storedNotificationIds.set([...this.storedNotificationIds(), schedule.id]);
        }
        continue;
      }

      const timeoutId = setTimeout(() => {
        if (!this.storedNotificationIds().includes(schedule.id)) {
          this.notify(`${schedule.title} está começando agora!`, schedule);
          this.storedNotificationIds.set([...this.storedNotificationIds(), schedule.id]);
        }
        this.startNotificationTimeouts.delete(schedule.id);
      }, millisecondsUntilStart);

      this.startNotificationTimeouts.set(schedule.id, timeoutId);
    }
  }

  private notify(message: string, schedule: ScheduleEntity): void {
    if (this.notifiedIds.has(schedule.id)) return;
    this.notifiedIds.add(schedule.id);

    if (this.notificationModalVisible()) {
      this.modalQueue.push(schedule);
      return;
    }

    this.currentNotification.set(schedule);
    this.notificationModalVisible.set(true);
  }

  private clearStartNotificationTimeouts(): void {
    this.startNotificationTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    this.startNotificationTimeouts.clear();
  }

  closeNotificationModal(): void {
    const next = this.modalQueue.shift() ?? null;
    this.currentNotification.set(next);
    this.notificationModalVisible.set(!!next);
  }

  private scheduleFromStorageIfValid(): void {
    const stored = this.loadSchedulesFromStorage();
    if (!stored) return;

    const schedules: ScheduleEntity[] = stored.schedules.map((item) => ({
      id: item.id,
      title: item.title,
      description: '',
      startDateTime: item.startDateTime,
      endDateTime: item.startDateTime,
      location: '',
      isAllDay: false,
      status: 'SCHEDULED',
    }));

    this.storedNotificationIds.set(schedules.map((item) => item.id));
  }

  private loadSchedulesFromStorage(): ScheduleNotificationStorage | null {
    try {
      const raw = localStorage.getItem(ScheduleNotificationService.STORAGE_KEY);
      if (!raw) return null;

      const parsed = JSON.parse(raw) as ScheduleNotificationStorage;
      if (!this.isValidStoragePayload(parsed)) {
        localStorage.removeItem(ScheduleNotificationService.STORAGE_KEY);
        return null;
      }

      return parsed;
    } catch {
      localStorage.removeItem(ScheduleNotificationService.STORAGE_KEY);
      return null;
    }
  }

  private saveSchedulesToStorage(schedules: ScheduleEntity[]): void {
    const validSchedules = schedules
      .filter((s) => s.status === 'SCHEDULED')
      .filter((s) => this.isValidDateTime(String(s.startDateTime)))
      .map((s) => ({
        id: Number(s.id),
        title: s.title ?? 'Agendamento',
        startDateTime: dayjs(s.startDateTime).toISOString(),
      }))
      .filter((s) => Number.isFinite(s.id) && s.id > 0);

    const payload: ScheduleNotificationStorage = {
      savedAt: dayjs().toISOString(),
      schedules: validSchedules,
    };

    localStorage.setItem(ScheduleNotificationService.STORAGE_KEY, JSON.stringify(payload));
  }

  private isValidStoragePayload(payload: any): payload is ScheduleNotificationStorage {
    if (!payload || typeof payload !== 'object') return false;
    if (!Array.isArray(payload.schedules)) return false;
    if (typeof payload.savedAt !== 'string' || !this.isValidDateTime(payload.savedAt)) return false;

    return payload.schedules.every((s: any) =>
      s &&
      typeof s === 'object' &&
      Number.isFinite(s.id) &&
      s.id > 0 &&
      typeof s.title === 'string' &&
      typeof s.startDateTime === 'string' &&
      this.isValidDateTime(s.startDateTime),
    );
  }

  private isValidDateTime(value: string): boolean {
    const date = dayjs(value);
    return date.isValid();
  }
}
