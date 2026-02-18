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

  onSaveEvent() {
    const form = this.eventForm();
    console.log({
      title: form.title,
      date: this.selectedDay()?.date,
      description: form.description,
      allDay: form.allDay,
    });
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

  private resetEventForm(defaults?: Partial<{ allDay: boolean }>) {
    this.eventForm.set({ title: '', description: '', allDay: defaults?.allDay ?? false });
    this.descriptionEditorVisible.set(false);
  }
}
