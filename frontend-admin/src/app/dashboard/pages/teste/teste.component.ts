import { Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TimeSlotPickerComponent } from 'app/shared/components/time-slot-picker/time-slot-picker.component';
import { FuseDatePickerComponent } from 'app/shared/components/date-picker/date-picker.component';

@Component({
  selector: 'fuse-teste',
  standalone: true,
  imports: [DatePipe, TimeSlotPickerComponent, FuseDatePickerComponent],
  templateUrl: './teste.component.html',
  styleUrl: './teste.component.scss',
})
export class TesteComponent {
  selected = signal<string | null>(null);
  selectedDate = signal<Date | null>(null);

  onTimeSelected(v: string) {
    this.selected.set(v ?? null);
  }

  onDateSelected(date: Date) {
    this.selectedDate.set(date);
  }
}
