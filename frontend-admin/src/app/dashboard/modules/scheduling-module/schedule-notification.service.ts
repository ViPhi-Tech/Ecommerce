import { DestroyRef, inject, Injectable, NgZone, OnDestroy, signal } from '@angular/core';
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

interface NotifiedIdsStorage {
  date: string;
  ids: number[];
}

@Injectable({
  providedIn: 'root',
})
export class ScheduleNotificationService implements OnDestroy {
  private schedulingService = inject(SchedulingService);
  private destroyedRef = inject(DestroyRef);
  private ngZone = inject(NgZone);

  private startNotificationTimeouts = new Map<number, ReturnType<typeof setTimeout>>();
  private modalQueue: ScheduleEntity[] = [];

  /** IDs já notificados — persiste por dia no localStorage */
  private notifiedIds = new Set<number>();

  notificationModalVisible = signal(false);
  currentNotification = signal<ScheduleEntity | null>(null);

  private static readonly SCHEDULES_KEY = 'schedule-notification-cache';
  private static readonly NOTIFIED_IDS_KEY = 'schedule-notified-ids';

  start(): void {
    this.loadNotifiedIdsFromStorage();
    this.getTodaySchedules();
  }

  stop(): void {
    this.clearStartNotificationTimeouts();
  }

  ngOnDestroy(): void {
    this.stop();
  }

  getTodaySchedules(): void {
    this.schedulingService.getAll(true).pipe(takeUntilDestroyed(this.destroyedRef)).subscribe({
      next: (res) => {
        const all = (res.data ?? res.dados ?? []) as ScheduleEntity[];
        const today = all.filter((s) => dayjs(s.startDateTime).isSame(dayjs(), 'day'));
        this.scheduleNotifications(today);
      },
      error: (err) => {
        console.error('[ScheduleNotification] Erro ao carregar agendamentos:', err);
        this.scheduleFromStorageIfValid();
      },
    });
  }

  private scheduleNotifications(schedules: ScheduleEntity[]): void {
    this.clearStartNotificationTimeouts();
    this.saveSchedulesToStorage(schedules);

    const now = dayjs();

    for (const schedule of schedules) {
      if (schedule.status !== 'SCHEDULED') continue;
      if (this.notifiedIds.has(schedule.id)) continue;

      const start = dayjs(schedule.startDateTime);
      const msUntilStart = start.diff(now);

      if (msUntilStart <= 0) {
        this.notify(schedule);
        continue;
      }

      const id = schedule.id;
      const timeoutId = this.ngZone.runOutsideAngular(() =>
        setTimeout(() => {
          this.ngZone.run(() => this.notify(schedule));
          this.startNotificationTimeouts.delete(id);
        }, msUntilStart),
      );

      this.startNotificationTimeouts.set(id, timeoutId);
    }
  }

  private notify(schedule: ScheduleEntity): void {
    if (this.notifiedIds.has(schedule.id)) return;

    this.notifiedIds.add(schedule.id);
    this.saveNotifiedIdsToStorage();

    if (this.notificationModalVisible()) {
      this.modalQueue.push(schedule);
      return;
    }

    this.currentNotification.set(schedule);
    this.notificationModalVisible.set(true);
  }

  closeNotificationModal(): void {
    const next = this.modalQueue.shift() ?? null;
    this.currentNotification.set(next);
    this.notificationModalVisible.set(!!next);
  }

  private clearStartNotificationTimeouts(): void {
    this.startNotificationTimeouts.forEach((id) => clearTimeout(id));
    this.startNotificationTimeouts.clear();
  }

  // ---------------------------------------------------------------------------
  // Notified IDs Storage — persiste quais agendamentos já mostraram modal hoje
  // ---------------------------------------------------------------------------

  private loadNotifiedIdsFromStorage(): void {
    try {
      const raw = localStorage.getItem(ScheduleNotificationService.NOTIFIED_IDS_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as NotifiedIdsStorage;
      if (!this.isValidNotifiedIdsPayload(parsed)) {
        localStorage.removeItem(ScheduleNotificationService.NOTIFIED_IDS_KEY);
        return;
      }

      const today = dayjs().format('YYYY-MM-DD');
      if (parsed.date !== today) {
        localStorage.removeItem(ScheduleNotificationService.NOTIFIED_IDS_KEY);
        return;
      }

      this.notifiedIds = new Set(parsed.ids);
    } catch {
      localStorage.removeItem(ScheduleNotificationService.NOTIFIED_IDS_KEY);
    }
  }

  private saveNotifiedIdsToStorage(): void {
    const payload: NotifiedIdsStorage = {
      date: dayjs().format('YYYY-MM-DD'),
      ids: Array.from(this.notifiedIds),
    };
    localStorage.setItem(ScheduleNotificationService.NOTIFIED_IDS_KEY, JSON.stringify(payload));
  }

  private isValidNotifiedIdsPayload(payload: any): payload is NotifiedIdsStorage {
    return (
      payload &&
      typeof payload === 'object' &&
      typeof payload.date === 'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(payload.date) &&
      Array.isArray(payload.ids) &&
      payload.ids.every((id: any) => Number.isFinite(id) && id > 0)
    );
  }

  // ---------------------------------------------------------------------------
  // Schedules Storage — cache de agendamentos (fallback offline)
  // ---------------------------------------------------------------------------

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

    this.scheduleNotifications(schedules);
  }

  private loadSchedulesFromStorage(): ScheduleNotificationStorage | null {
    try {
      const raw = localStorage.getItem(ScheduleNotificationService.SCHEDULES_KEY);
      if (!raw) return null;

      const parsed = JSON.parse(raw) as ScheduleNotificationStorage;
      if (!this.isValidSchedulesPayload(parsed)) {
        localStorage.removeItem(ScheduleNotificationService.SCHEDULES_KEY);
        return null;
      }

      return parsed;
    } catch {
      localStorage.removeItem(ScheduleNotificationService.SCHEDULES_KEY);
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

    localStorage.setItem(ScheduleNotificationService.SCHEDULES_KEY, JSON.stringify(payload));
  }

  private isValidSchedulesPayload(payload: any): payload is ScheduleNotificationStorage {
    if (!payload || typeof payload !== 'object') return false;
    if (!Array.isArray(payload.schedules)) return false;
    if (typeof payload.savedAt !== 'string' || !this.isValidDateTime(payload.savedAt)) return false;

    return payload.schedules.every(
      (s: any) =>
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
    return dayjs(value).isValid();
  }
}
