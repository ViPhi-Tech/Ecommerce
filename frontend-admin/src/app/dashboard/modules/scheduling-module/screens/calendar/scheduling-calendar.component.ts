import { Component, OnInit, inject, signal, computed, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';
import {
  EventCreateComponent,
  CalendarEvent,
  EventSavePayload,
} from '../../components/event-create/event-create.component';
import {
  CreateScheduleDTO,
  ScheduleEntity,
  SchedulingService,
  UpdateScheduleDTO,
} from '../../scheduling.service';

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.locale('pt-br');

@Component({
  selector: 'fuse-scheduling-calendar',
  templateUrl: './scheduling-calendar.component.html',
  styleUrls: ['./scheduling-calendar.component.scss'],
  imports: [
    CommonModule,
    ButtonModule,
    SelectButtonModule,
    FormsModule,
    CardModule,
    EventCreateComponent,
  ],
})
export class SchedulingCalendarComponent implements OnInit {
  private schedulingService = inject(SchedulingService);
  @ViewChild('eventCreate') eventCreate?: EventCreateComponent;

  viewOptions = signal([
    { label: 'Mês', value: 'month', icon: 'pi pi-calendar' },
    { label: 'Semana', value: 'week', icon: 'pi pi-calendar-plus' },
    { label: 'Dia', value: 'day', icon: 'pi pi-clock' },
  ]);

  private static readonly VIEW_STORAGE_KEY = 'scheduling-calendar-view';

  selectedView = signal<'month' | 'week' | 'day'>(
    (localStorage.getItem(SchedulingCalendarComponent.VIEW_STORAGE_KEY) as 'month' | 'week' | 'day') || 'month',
  );
  currentDate = signal(new Date());

  currentTitle = computed(() => {
    const date = dayjs(this.currentDate());
    const view = this.selectedView();

    if (view === 'month') {
      return date.format('MMMM [de] YYYY');
    } else if (view === 'week') {
      const start = date.startOf('week');
      const end = date.endOf('week');
      return `${start.format('DD MMM')} - ${end.format('DD MMM YYYY')}`;
    } else {
      return date.format('DD [de] MMMM [de] YYYY');
    }
  });

  weekDays = computed(() => {
    const date = dayjs(this.currentDate());
    const startOfWeek = date.startOf('week');
    return Array.from({ length: 7 }, (_, i) => {
      const day = startOfWeek.add(i, 'day');
      return {
        date: day.toDate(),
        day: day.date(),
        dayName: day.format('ddd'),
        isToday: day.isSame(dayjs(), 'day'),
      };
    });
  });

  timeSlots = computed(() => {
    return Array.from({ length: 24 }, (_, i) => {
      return {
        hour: i,
        label: `${i.toString().padStart(2, '0')}:00`,
      };
    });
  });

  monthDays = computed(() => {
    const date = dayjs(this.currentDate());
    const startOfMonth = date.startOf('month');
    const endOfMonth = date.endOf('month');
    const startDate = startOfMonth.startOf('week');
    const endDate = endOfMonth.endOf('week');

    const days = [];
    let currentDay = startDate;

    while (currentDay.isBefore(endDate) || currentDay.isSame(endDate, 'day')) {
      days.push({
        date: currentDay.toDate(),
        day: currentDay.date(),
        month: currentDay.month(),
        year: currentDay.year(),
        isCurrentMonth: currentDay.month() === date.month(),
        isToday: currentDay.isSame(dayjs(), 'day'),
        dayOfWeek: currentDay.day(),
      });
      currentDay = currentDay.add(1, 'day');
    }

    return days;
  });

  weekDaysNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  events = signal<CalendarEvent[]>([]);

  currentDayForDayView = computed(() => {
    const date = dayjs(this.currentDate());
    return {
      date: date.toDate(),
      day: date.date(),
      isCurrentMonth: true,
      isToday: date.isSame(dayjs(), 'day'),
    };
  });

  ngOnInit() {
    this.loadSchedules();
  }

  onViewChange(view: 'month' | 'week' | 'day') {
    this.selectedView.set(view);
    localStorage.setItem(SchedulingCalendarComponent.VIEW_STORAGE_KEY, view);
  }

  previousPeriod() {
    const date = dayjs(this.currentDate());
    const view = this.selectedView();

    let newDate: dayjs.Dayjs;
    if (view === 'month') {
      newDate = date.subtract(1, 'month');
    } else if (view === 'week') {
      newDate = date.subtract(1, 'week');
    } else {
      newDate = date.subtract(1, 'day');
    }

    this.currentDate.set(newDate.toDate());
  }

  nextPeriod() {
    const date = dayjs(this.currentDate());
    const view = this.selectedView();

    let newDate: dayjs.Dayjs;
    if (view === 'month') {
      newDate = date.add(1, 'month');
    } else if (view === 'week') {
      newDate = date.add(1, 'week');
    } else {
      newDate = date.add(1, 'day');
    }

    this.currentDate.set(newDate.toDate());
  }

  goToToday() {
    this.currentDate.set(new Date());
  }

  onDayClick(day: any, event?: MouseEvent) {
    this.eventCreate?.openForDay(day, event?.currentTarget as HTMLElement);
  }

  onTimeSlotClick(slot: any, day: any, event?: MouseEvent) {
    this.eventCreate?.openForTimeSlot(slot, day, event?.currentTarget as HTMLElement);
  }

  onEventClick(ev: CalendarEvent, event: Event) {
    event.stopPropagation();
    this.eventCreate?.openForEvent(ev, event.currentTarget as HTMLElement);
  }

  onEventSaved(payload: EventSavePayload) {
    const dateTime = this.buildDateTimes(payload);
    const basePayload: CreateScheduleDTO = {
      title: payload.form.title.trim(),
      description: payload.form.description?.trim() || null,
      startDateTime: dateTime.startDateTime,
      endDateTime: dateTime.endDateTime,
      isAllDay: payload.form.allDay,
      status: 'SCHEDULED',
      location: null,
    };

    if (payload.editingId) {
      const id = Number(payload.editingId);
      const updatePayload: UpdateScheduleDTO = { ...basePayload };
      this.schedulingService.update(id, updatePayload).subscribe({
        next: () => this.loadSchedules(true),
        error: (err) => console.error('Erro ao atualizar agendamento:', err),
      });
      return;
    }

    this.schedulingService.create(basePayload).subscribe({
      next: () => this.loadSchedules(true),
      error: (err) => console.error('Erro ao criar agendamento:', err),
    });
  }

  onEventDeleted(eventId: string) {
    const id = Number(eventId);
    this.schedulingService.delete(id).subscribe({
      next: () => this.loadSchedules(true),
      error: (err) => console.error('Erro ao deletar agendamento:', err),
    });
  }

  readonly SLOT_HEIGHT = 60;

  getEventsForDay(date: Date): CalendarEvent[] {
    const d = dayjs(date);
    return this.events().filter((e) => dayjs(e.date).isSame(d, 'day'));
  }

  getAllDayEvents(date: Date): CalendarEvent[] {
    return this.getEventsForDay(date).filter((e) => e.allDay);
  }

  getTimedEventsForDay(date: Date): CalendarEvent[] {
    return this.getEventsForDay(date).filter((e) => !e.allDay && e.startHour != null);
  }

  getEventTop(ev: CalendarEvent): number {
    return (ev.startHour ?? 0) * this.SLOT_HEIGHT;
  }

  getEventHeight(ev: CalendarEvent): number {
    const start = ev.startHour ?? 0;
    const end = ev.endHour ?? start + 1;
    return Math.max((end - start) * this.SLOT_HEIGHT, this.SLOT_HEIGHT);
  }

  getEventLeft(ev: CalendarEvent, date: Date): string {
    const layout = this.computeEventLayout(date);
    const info = layout.get(ev.id);
    if (!info || info.total <= 1) return '0';
    return `${(info.column / info.total) * 100}%`;
  }

  getEventWidth(ev: CalendarEvent, date: Date): string {
    const layout = this.computeEventLayout(date);
    const info = layout.get(ev.id);
    if (!info || info.total <= 1) return '100%';
    return `${(1 / info.total) * 100}%`;
  }

  private computeEventLayout(date: Date): Map<string, { column: number; total: number }> {
    const events = this.getTimedEventsForDay(date)
      .sort((a, b) => (a.startHour ?? 0) - (b.startHour ?? 0));

    if (events.length === 0) return new Map();

    const groups: CalendarEvent[][] = [];
    let currentGroup: CalendarEvent[] = [];
    let groupEnd = 0;

    for (const ev of events) {
      const start = ev.startHour ?? 0;
      const end = ev.endHour ?? start + 1;

      if (currentGroup.length === 0 || start < groupEnd) {
        currentGroup.push(ev);
        groupEnd = Math.max(groupEnd, end);
      } else {
        groups.push(currentGroup);
        currentGroup = [ev];
        groupEnd = end;
      }
    }
    if (currentGroup.length > 0) groups.push(currentGroup);

    const layout = new Map<string, { column: number; total: number }>();

    for (const group of groups) {
      const columns: number[] = [];

      for (const ev of group) {
        const start = ev.startHour ?? 0;
        const end = ev.endHour ?? start + 1;
        let placed = -1;
        for (let c = 0; c < columns.length; c++) {
          if (columns[c] <= start) {
            placed = c;
            break;
          }
        }
        if (placed === -1) {
          placed = columns.length;
          columns.push(0);
        }
        columns[placed] = end;
        layout.set(ev.id, { column: placed, total: 0 });
      }

      const total = columns.length;
      for (const ev of group) {
        layout.get(ev.id)!.total = total;
      }
    }

    return layout;
  }

  private loadSchedules(skipLoader = false) {
    this.schedulingService.getAll(skipLoader).subscribe({
      next: (res) => {
        const raw = res.data ?? res.dados ?? [];
        this.events.set((raw as ScheduleEntity[]).map((item) => this.mapToCalendarEvent(item)));
      },
      error: (err) => {
        console.error('Erro ao carregar agendamentos:', err);
        this.events.set([]);
      },
    });
  }

  private mapToCalendarEvent(item: ScheduleEntity): CalendarEvent {
    const start = dayjs(item.startDateTime);
    const end = dayjs(item.endDateTime);
    const isAllDay = !!item.isAllDay;

    return {
      id: String(item.id),
      title: item.title,
      description: item.description ?? '',
      date: start.toDate(),
      allDay: isAllDay,
      startHour: isAllDay ? undefined : start.hour() + start.minute() / 60,
      endHour: isAllDay ? undefined : end.hour() + end.minute() / 60,
      color: this.getColorByStatus(item.status),
    };
  }

  private getColorByStatus(status: ScheduleEntity['status']) {
    if (status === 'COMPLETED') return '#10b981';
    if (status === 'CANCELLED') return '#ef4444';
    return '#3b82f6';
  }

  private buildDateTimes(payload: EventSavePayload): {
    startDateTime: Date;
    endDateTime: Date;
  } {
    const base = dayjs(payload.day);
    const allDay = payload.form.allDay;

    if (allDay) {
      return {
        startDateTime: base.startOf('day').toDate(),
        endDateTime: base.endOf('day').toDate(),
      };
    }

    const startFrac = payload.hour ?? 9;
    const endFrac = payload.endHour ?? Math.min(startFrac + 1, 23 + 55 / 60);
    const normalizedEnd = endFrac <= startFrac ? Math.min(startFrac + 5 / 60, 23 + 55 / 60) : endFrac;

    return {
      startDateTime: base
        .hour(Math.floor(startFrac))
        .minute(Math.round((startFrac % 1) * 60))
        .second(0)
        .millisecond(0)
        .toDate(),
      endDateTime: base
        .hour(Math.floor(normalizedEnd))
        .minute(Math.round((normalizedEnd % 1) * 60))
        .second(0)
        .millisecond(0)
        .toDate(),
    };
  }

}
