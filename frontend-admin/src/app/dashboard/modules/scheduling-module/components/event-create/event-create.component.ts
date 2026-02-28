import { Component, signal, computed, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TextEditorComponent } from 'app/shared/components/text-editor/text-editor.component';
import { FuseDatePickerComponent } from 'app/shared/components/date-picker/date-picker.component';
import { TimeSlotInterval, TimeSlotPickerComponent } from 'app/shared/components/time-slot-picker/time-slot-picker.component';
import dayjs from 'dayjs';
import { getNextHorario } from 'app/shared/constants/horarios';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  allDay: boolean;
  startHour?: number;
  endHour?: number;
  startHourFormatted?: string;
  endHourFormatted?: string;
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
  hour: string | null;
  endHour: string | null;
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
    DialogModule,
    TextEditorComponent,
    FuseDatePickerComponent,
    TimeSlotPickerComponent,
  ],
})
export class EventCreateComponent {
  selectedDay = signal<{ date: Date; day: number; isCurrentMonth: boolean; isToday: boolean } | null>(null);
  editingEventId = signal<string | null>(null);
  eventForm = signal<EventFormData>({ title: '', description: '', allDay: false });
  descriptionEditorVisible = signal(false);
  dateTimeEditorVisible = signal(false);
  selectedHour = signal<string | null>(null);
  selectedEndHour = signal<string | null>(null);

  formDateValue = computed(() => this.selectedDay()?.date ?? new Date());

  startTimeFormatted = computed(() => {
    return this.selectedHour();
  });

  endTimeFormatted = computed(() => {
    return this.selectedEndHour();
  });

  formattedSelectedDate = computed(() => {
    const day = this.selectedDay();
    if (!day) return '';
    const hour = this.selectedHour();
    const endHour = this.selectedEndHour();
    const dateStr = dayjs(day.date).format('dddd, D [de] MMMM');
    if (hour == null) return dateStr;
    if (endHour != null) {
      return `${dateStr} · ${hour} – ${endHour}`;
    }
    return `${dateStr} · ${hour}`;
  });

  saved = output<EventSavePayload>();
  deleted = output<string>();
  interval = signal<TimeSlotInterval>(15);

  openForDay(day: any) {
    this.hide();
    this.selectedDay.set(day);
    this.setStartAndEndHour();
  }

  openForTimeSlot(slot: { hour: number }, day: any) {
    this.hide();
    this.selectedDay.set(day);
    this.resetForm({ allDay: false });
  }

  openForEvent(ev: CalendarEvent) {
    this.hide();
    const d = dayjs(ev.date);
    this.selectedDay.set({
      date: ev.date,
      day: d.date(),
      isCurrentMonth: true,
      isToday: d.isSame(dayjs(), 'day'),
    });
    this.selectedHour.set(ev.startHourFormatted ?? null);
    this.selectedEndHour.set(ev.endHourFormatted ?? null);
    this.editingEventId.set(ev.id ?? null);
    this.eventForm.set({
      title: ev.title,
      description: ev.description,
      allDay: ev.allDay,
    });
    this.descriptionEditorVisible.set(!!ev.description);
    this.dateTimeEditorVisible.set(false);
  }

  hide() {
    this.selectedDay.set(null);
  }

  show() {
    // Mantido para compatibilidade com chamadas externas; o modal abre quando selectedDay é setado
  }

  onSave() {
    const day = this.selectedDay();
    if (!day) return;
    this.saved.emit({
      form: { ...this.eventForm() },
      editingId: this.editingEventId(),
      day: day.date,
      hour: this.selectedHour() ? this.selectedHour() : null,
      endHour: this.selectedEndHour() ? this.selectedEndHour() : null,
    });
    this.hide();
  }

  onDelete() {
    const editingId = this.editingEventId();
    if (!editingId) return;
    this.deleted.emit(editingId);
    this.hide();
  }

  setStartAndEndHour() {
    const data = dayjs().format('HH:mm');
    const nextHorario = getNextHorario(data, this.interval());
    if (nextHorario) {
      this.selectedHour.set(nextHorario.start);
      this.selectedEndHour.set(nextHorario.end);
    }
  }

  updateEventForm(key: string, value: string | boolean) {
    if (key == 'allDay' && value == false) {
      this.setStartAndEndHour();
    }
    if (key == 'allDay' && value == true) {
      this.selectedHour.set(null);
      this.selectedEndHour.set(null);
    }
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

  onStartTimeFromPicker(timeStr: string) {
    this.selectedHour.set(timeStr);
    const endHour = this.selectedEndHour();
    if (endHour == null || endHour <= timeStr) {
      this.selectedEndHour.set(getNextHorario(timeStr, this.interval())?.end ?? null);
    }
    if (this.eventForm().allDay) this.updateEventForm('allDay', false);
  }

  onEndTimeFromPicker(timeStr: string) {
    this.selectedEndHour.set(timeStr);
    if (this.eventForm().allDay) this.updateEventForm('allDay', false);
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
