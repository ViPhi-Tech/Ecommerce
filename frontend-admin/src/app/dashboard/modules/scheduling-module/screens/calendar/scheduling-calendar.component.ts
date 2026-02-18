import { Component, OnInit, signal, computed, ViewChild } from '@angular/core';
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

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.locale('pt-br');

const today = dayjs();

const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    title: 'Reunião de planejamento',
    description: 'Planejamento do sprint da semana',
    date: today.toDate(),
    allDay: true,
    color: '#3b82f6',
  },
  {
    id: '2',
    title: 'Almoço com cliente',
    description: '',
    date: today.toDate(),
    allDay: false,
    startHour: 12,
    endHour: 13,
    color: '#10b981',
  },
  {
    id: '3',
    title: 'Code review',
    description: 'Revisar PR #42 do módulo de pagamentos',
    date: today.toDate(),
    allDay: false,
    startHour: 15,
    endHour: 16,
    color: '#f59e0b',
  },
  {
    id: '4',
    title: 'Daily standup',
    description: '',
    date: today.toDate(),
    allDay: false,
    startHour: 9,
    endHour: 10,
    color: '#8b5cf6',
  },
];

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

  events = signal<CalendarEvent[]>(MOCK_EVENTS);

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
    if (payload.editingId) {
      this.events.update((list) =>
        list.map((e) =>
          e.id === payload.editingId
            ? { ...e, title: payload.form.title, description: payload.form.description, allDay: payload.form.allDay }
            : e,
        ),
      );
    } else {
      const newEvent: CalendarEvent = {
        id: crypto.randomUUID(),
        title: payload.form.title,
        description: payload.form.description,
        date: payload.day,
        allDay: payload.form.allDay,
        startHour: payload.hour ?? undefined,
        endHour: payload.hour != null ? payload.hour + 1 : undefined,
        color: '#3b82f6',
      };
      this.events.update((list) => [...list, newEvent]);
    }
  }

  onEventDeleted(eventId: string) {
    this.events.update((list) => list.filter((e) => e.id !== eventId));
  }

  getEventsForDay(date: Date): CalendarEvent[] {
    const d = dayjs(date);
    return this.events().filter((e) => dayjs(e.date).isSame(d, 'day'));
  }

  getAllDayEvents(date: Date): CalendarEvent[] {
    return this.getEventsForDay(date).filter((e) => e.allDay);
  }

  getSlotEvents(date: Date, hour: number): CalendarEvent[] {
    return this.getEventsForDay(date).filter(
      (e) => !e.allDay && e.startHour === hour,
    );
  }

}
