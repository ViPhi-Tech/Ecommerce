import { DestroyRef, inject, Injectable, OnDestroy, signal } from '@angular/core';
import { SchedulingService, ScheduleEntity } from './scheduling.service';
import dayjs from 'dayjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

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

  /** Recarrega e reagenda as notificações do dia — chamar após criar/editar/remover agendamentos */
  refresh(): void {
    this.getTodaySchedules();
  }

  stop(): void {
    this.clearStartNotificationTimeouts();
  }

  ngOnDestroy(): void {
    this.stop();
  }

  getTodaySchedules(): void {
    this.schedulingService.getTodaySchedules().pipe(takeUntilDestroyed(this.destroyedRef)).subscribe({
      next: (res) => {
        const all = (res.data ?? res.dados ?? []) as ScheduleEntity[];
        const today = all.filter((s) => dayjs(s.startDateTime).isSame(dayjs(), 'day'));
        localStorage.removeItem(ScheduleNotificationService.SCHEDULES_KEY);
        this.scheduleNotifications(today);
      },
      error: (err) => {
        console.error('[ScheduleNotification] Erro ao carregar agendamentos:', err);
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
      console.log(msUntilStart);
      
      if (msUntilStart <= 0) {
        if (!this.notifiedIds.has(schedule.id)) {
          this.notify(schedule);
          this.startNotificationTimeouts.delete(schedule.id);
        }
      }

      const id = schedule.id;
      const timeoutId = setTimeout(() => {
        this.notify(schedule)
        this.startNotificationTimeouts.delete(id);
      }, msUntilStart);

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

  private isValidNotifiedIdsPayload(payload: unknown): payload is NotifiedIdsStorage {
    if (!payload || typeof payload !== 'object') return false;
    const obj = payload as Record<string, unknown>;
    return (
      typeof obj['date'] === 'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(obj['date']) &&
      Array.isArray(obj['ids']) &&
      (obj['ids'] as unknown[]).every((id) => typeof id === 'number' && Number.isFinite(id) && id > 0)
    );
  }

  // ---------------------------------------------------------------------------
  // Schedules Storage — cache de agendamentos (fallback offline)
  // ---------------------------------------------------------------------------

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

  private isValidSchedulesPayload(payload: unknown): payload is ScheduleNotificationStorage {
    if (!payload || typeof payload !== 'object') return false;
    const obj = payload as Record<string, unknown>;
    if (!Array.isArray(obj['schedules'])) return false;
    if (typeof obj['savedAt'] !== 'string' || !this.isValidDateTime(obj['savedAt'])) return false;

    return (obj['schedules'] as unknown[]).every((s) => {
      if (!s || typeof s !== 'object') return false;
      const item = s as Record<string, unknown>;
      return (
        typeof item['id'] === 'number' &&
        Number.isFinite(item['id']) &&
        (item['id'] as number) > 0 &&
        typeof item['title'] === 'string' &&
        typeof item['startDateTime'] === 'string' &&
        this.isValidDateTime(item['startDateTime'])
      );
    });
  }

  private isValidDateTime(value: string): boolean {
    return dayjs(value).isValid();
  }
}
