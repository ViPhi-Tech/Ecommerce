import { Component, signal } from '@angular/core';
import { TimeSlotPickerComponent } from 'app/shared/components/time-slot-picker/time-slot-picker.component';

@Component({
  selector: 'fuse-teste',
  standalone: true,
  imports: [TimeSlotPickerComponent],
  templateUrl: './teste.component.html',
  styleUrl: './teste.component.scss',
})
export class TesteComponent {
  selected = signal<string | null>(null);

  onTimeSelected(v: string) {
    this.selected.set(v ?? null);
  }
}
