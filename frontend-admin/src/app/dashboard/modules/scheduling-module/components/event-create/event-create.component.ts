import { Component, ViewChild, signal, computed, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { TextEditorComponent } from 'app/shared/components/text-editor/text-editor.component';
import {
  NgxFloatUiModule,
  NgxFloatUiDirective,
  NgxFloatUiPlacements,
  NgxFloatUiTriggers,
} from 'ngx-float-ui';
import dayjs from 'dayjs';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  allDay: boolean;
  startHour?: number;
  endHour?: number;
  color: string;
}

export interface EventFormData {
  title: string;
  description: string;
  allDay: boolean;
}

export interface EventSavePayload {
  form: EventFormData;
  editingId: string | null;
  day: Date;
  hour: number | null;
  endHour: number | null;
}

@Component({
  selector: 'fuse-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.scss'],
  imports: [
    FormsModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule,
    DatePickerModule,
    TextEditorComponent,
    NgxFloatUiModule,
  ],
})
export class EventCreateComponent {
  @ViewChild('dayFloatTrigger') dayFloatTrigger?: NgxFloatUiDirective;

  NgxFloatUiTriggers = NgxFloatUiTriggers;
  NgxFloatUiPlacements = NgxFloatUiPlacements;

  private floatTargetElement: HTMLElement | null = null;

  get floatTargetOrAnchor(): HTMLElement {
    return this.floatTargetElement ?? document.body;
  }

  selectedDay = signal<{ date: Date; day: number; isCurrentMonth: boolean; isToday: boolean } | null>(null);
  editingEventId = signal<string | null>(null);
  eventForm = signal<EventFormData>({ title: '', description: '', allDay: false });
  descriptionEditorVisible = signal(false);
  dateTimeEditorVisible = signal(false);
  selectedHour = signal<number | null>(null);
  selectedEndHour = signal<number | null>(null);

  formDateValue = computed(() => this.selectedDay()?.date ?? new Date());

  formStartTime = computed(() => {
    const hour = this.selectedHour();
    if (hour == null) return null;
    const d = new Date();
    d.setHours(hour, 0, 0, 0);
    return d;
  });

  formEndTime = computed(() => {
    const hour = this.selectedEndHour();
    if (hour == null) return null;
    const d = new Date();
    d.setHours(hour, 0, 0, 0);
    return d;
  });

  formattedSelectedDate = computed(() => {
    const day = this.selectedDay();
    if (!day) return '';
    const hour = this.selectedHour();
    const endHour = this.selectedEndHour();
    const dateStr = dayjs(day.date).format('dddd, D [de] MMMM');
    if (hour == null) return dateStr;
    const startLabel = `${hour.toString().padStart(2, '0')}:00`;
    if (endHour != null) {
      const endLabel = `${endHour.toString().padStart(2, '0')}:00`;
      return `${dateStr} · ${startLabel} – ${endLabel}`;
    }
    return `${dateStr} · ${startLabel}`;
  });

  saved = output<EventSavePayload>();
  deleted = output<string>();

  openForDay(day: any, target: HTMLElement) {
    this.hide();
    this.selectedDay.set(day);
    this.selectedHour.set(null);
    this.selectedEndHour.set(null);
    this.resetForm({ allDay: true });
    this.floatTargetElement = target;
    setTimeout(() => this.dayFloatTrigger?.show(), 0);
  }

  openForTimeSlot(slot: { hour: number }, day: any, target: HTMLElement) {
    this.hide();
    this.selectedDay.set(day);
    this.selectedHour.set(slot.hour);
    this.selectedEndHour.set(Math.min(slot.hour + 1, 23));
    this.resetForm({ allDay: false });
    this.floatTargetElement = target;
    setTimeout(() => this.dayFloatTrigger?.show(), 0);
  }

  openForEvent(ev: CalendarEvent, target: HTMLElement) {
    this.hide();
    const d = dayjs(ev.date);
    this.selectedDay.set({
      date: ev.date,
      day: d.date(),
      isCurrentMonth: true,
      isToday: d.isSame(dayjs(), 'day'),
    });
    this.selectedHour.set(ev.startHour ?? null);
    this.selectedEndHour.set(ev.endHour ?? null);
    this.editingEventId.set(ev.id);
    this.eventForm.set({
      title: ev.title,
      description: ev.description,
      allDay: ev.allDay,
    });
    this.descriptionEditorVisible.set(!!ev.description);
    this.dateTimeEditorVisible.set(false);
    this.floatTargetElement = target;
    setTimeout(() => this.show(), 0);
  }

  hide() {
    this.dayFloatTrigger?.hide();
  }

  show() {
    this.dayFloatTrigger?.show();
  }

  onSave() {
    const day = this.selectedDay();
    if (!day) return;
    this.saved.emit({
      form: { ...this.eventForm() },
      editingId: this.editingEventId(),
      day: day.date,
      hour: this.selectedHour(),
      endHour: this.selectedEndHour(),
    });
    this.hide();
  }

  onDelete() {
    const editingId = this.editingEventId();
    if (!editingId) return;
    this.deleted.emit(editingId);
    this.hide();
  }

  updateEventForm(key: string, value: string | boolean) {
    this.eventForm.update((f) => ({ ...f, [key]: value }));
  }

  toggleDateTimeEditor() {
    this.dateTimeEditorVisible.set(!this.dateTimeEditorVisible());
  }

  onDateChange(date: Date) {
    if (!date) return;
    const d = dayjs(date);
    this.selectedDay.set({
      date,
      day: d.date(),
      isCurrentMonth: true,
      isToday: d.isSame(dayjs(), 'day'),
    });
  }

  onStartTimeChange(time: Date) {
    if (!time) return;
    const hour = time.getHours();
    this.selectedHour.set(hour);
    const endHour = this.selectedEndHour();
    if (endHour == null || endHour <= hour) {
      this.selectedEndHour.set(Math.min(hour + 1, 23));
    }
    if (this.eventForm().allDay) {
      this.updateEventForm('allDay', false);
    }
  }

  onEndTimeChange(time: Date) {
    if (!time) return;
    this.selectedEndHour.set(time.getHours());
    if (this.eventForm().allDay) {
      this.updateEventForm('allDay', false);
    }
  }

  toggleDescriptionEditor() {
    this.descriptionEditorVisible.set(!this.descriptionEditorVisible());
  }

  capitalizeFirst(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private resetForm(defaults?: Partial<{ allDay: boolean }>) {
    this.editingEventId.set(null);
    this.eventForm.set({ title: '', description: '', allDay: defaults?.allDay ?? false });
    this.descriptionEditorVisible.set(false);
    this.dateTimeEditorVisible.set(false);
  }
}
