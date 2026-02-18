import { Component, OnInit, signal, computed, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { TextEditorComponent } from 'app/shared/components/text-editor/text-editor.component';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';
import {
  NgxFloatUiModule,
  NgxFloatUiDirective,
  NgxFloatUiPlacements,
  NgxFloatUiTriggers,
} from 'ngx-float-ui';

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.locale('pt-br');

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  allDay: boolean;
  startHour?: number;
  endHour?: number;
  color: string;
}

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
    InputTextModule,
    DividerModule,
    CheckboxModule,
    TextEditorComponent,
    NgxFloatUiModule,
  ],
})
export class SchedulingCalendarComponent implements OnInit {
  @ViewChild('dayFloatTrigger') dayFloatTrigger?: NgxFloatUiDirective;

  NgxFloatUiTriggers = NgxFloatUiTriggers;
  NgxFloatUiPlacements = NgxFloatUiPlacements;

  private floatTargetElement: HTMLElement | null = null;

  get floatTargetOrAnchor(): HTMLElement {
    return this.floatTargetElement ?? document.body;
  }

  viewOptions = signal([
    { label: 'Mês', value: 'month', icon: 'pi pi-calendar' },
    { label: 'Semana', value: 'week', icon: 'pi pi-calendar-plus' },
    { label: 'Dia', value: 'day', icon: 'pi pi-clock' },
  ]);

  selectedView = signal<'month' | 'week' | 'day'>('month');
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

  selectedDay = signal<{
    date: Date;
    day: number;
    isCurrentMonth: boolean;
    isToday: boolean;
  } | null>(null);

  events = signal<CalendarEvent[]>(MOCK_EVENTS);

  editingEventId = signal<string | null>(null);
  eventForm = signal({ title: '', description: '', allDay: false });
  descriptionEditorVisible = signal(false);
  selectedHour = signal<number | null>(null);

  currentDayForDayView = computed(() => {
    const date = dayjs(this.currentDate());
    return {
      date: date.toDate(),
      day: date.date(),
      isCurrentMonth: true,
      isToday: date.isSame(dayjs(), 'day'),
    };
  });

  formattedSelectedDate = computed(() => {
    const day = this.selectedDay();
    if (!day) return '';
    const hour = this.selectedHour();
    const dateStr = dayjs(day.date).format('dddd, D [de] MMMM');
    if (hour == null) return dateStr;
    const hourLabel = `${hour.toString().padStart(2, '0')}:00`;
    return `${dateStr} · ${hourLabel}`;
  });

  ngOnInit() {
  }

  onViewChange(view: 'month' | 'week' | 'day') {
    this.selectedView.set(view);
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
    this.dayFloatTrigger?.hide();
    this.selectedDay.set(day);
    this.selectedHour.set(null);
    this.resetEventForm({ allDay: true });
    this.floatTargetElement = event?.currentTarget as HTMLElement;
    setTimeout(() => this.dayFloatTrigger?.show(), 0);
  }

  onTimeSlotClick(slot: any, day: any, event?: MouseEvent) {
    this.dayFloatTrigger?.hide();
    this.selectedDay.set(day);
    this.selectedHour.set(slot.hour);
    this.resetEventForm({ allDay: false });
    this.floatTargetElement = event?.currentTarget as HTMLElement;
    setTimeout(() => this.dayFloatTrigger?.show(), 0);
  }

  onEventClick(ev: CalendarEvent, event: Event) {
    event.stopPropagation();
    this.dayFloatTrigger?.hide();

    const d = dayjs(ev.date);
    this.selectedDay.set({
      date: ev.date,
      day: d.date(),
      isCurrentMonth: true,
      isToday: d.isSame(dayjs(), 'day'),
    });
    this.selectedHour.set(ev.startHour ?? null);
    this.editingEventId.set(ev.id);
    this.eventForm.set({
      title: ev.title,
      description: ev.description,
      allDay: ev.allDay,
    });
    this.descriptionEditorVisible.set(!!ev.description);

    this.floatTargetElement = event.currentTarget as HTMLElement;
    setTimeout(() => this.dayFloatTrigger?.show(), 0);
  }

  onSaveEvent() {
    const form = this.eventForm();
    const editingId = this.editingEventId();

    if (editingId) {
      this.events.update((list) =>
        list.map((e) =>
          e.id === editingId
            ? { ...e, title: form.title, description: form.description, allDay: form.allDay }
            : e,
        ),
      );
    } else {
      const newEvent: CalendarEvent = {
        id: crypto.randomUUID(),
        title: form.title,
        description: form.description,
        date: this.selectedDay()?.date ?? new Date(),
        allDay: form.allDay,
        startHour: this.selectedHour() ?? undefined,
        endHour: this.selectedHour() != null ? this.selectedHour()! + 1 : undefined,
        color: '#3b82f6',
      };
      this.events.update((list) => [...list, newEvent]);
    }

    this.dayFloatTrigger?.hide();
  }

  onDeleteEvent() {
    const editingId = this.editingEventId();
    if (!editingId) return;
    this.events.update((list) => list.filter((e) => e.id !== editingId));
    this.dayFloatTrigger?.hide();
  }

  onMoreOptions() {
    this.dayFloatTrigger?.hide();
  }

  capitalizeFirst(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  updateEventForm(key: string, value: string | boolean) {
    this.eventForm.update((f) => ({ ...f, [key]: value }));
  }

  toggleDescriptionEditor() {
    this.descriptionEditorVisible.set(!this.descriptionEditorVisible());
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

  private resetEventForm(defaults?: Partial<{ allDay: boolean }>) {
    this.editingEventId.set(null);
    this.eventForm.set({ title: '', description: '', allDay: defaults?.allDay ?? false });
    this.descriptionEditorVisible.set(false);
  }
}
