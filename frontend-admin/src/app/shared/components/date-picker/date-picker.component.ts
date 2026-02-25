import {
  Component,
  input,
  output,
  signal,
  inject,
  HostListener,
  ElementRef,
  computed,
  effect,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import dayjs from 'dayjs';

@Component({
  selector: 'fuse-date-picker',
  standalone: true,
  imports: [FormsModule, DatePickerModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
  host: { class: 'fuse-date-picker-host' },
})
export class FuseDatePickerComponent {
  private hostRef = inject(ElementRef);

  /** Data inicial (Date ou null) */
  value = input<Date | null>(null);

  /** Formato de exibição no botão (ex: "DD/MM/YYYY") */
  displayFormat = input<string>('DD/MM/YYYY');

  /** Formato do PrimeNG (ex: "dd/mm/yy") */
  dateFormat = input<string>('dd/mm/yy');

  /** Data mínima selecionável */
  minDate = input<Date | null>(null);

  /** Data máxima selecionável */
  maxDate = input<Date | null>(null);

  /** Placeholder quando não há data */
  placeholder = input<string>('Selecione a data');

  dateSelected = output<Date>();

  showPanel = signal(false);
  internalDate = signal<Date | null>(null);

  displayText = computed(() => {
    const d = this.internalDate();
    if (!d) return this.placeholder();
    return dayjs(d).format(this.displayFormat());
  });

  constructor() {
    effect(() => {
      const v = this.value();
      this.internalDate.set(v ?? null);
    });
  }

  openPanel() {
    const v = this.value();
    this.internalDate.set(v ?? new Date());
    this.showPanel.set(true);
  }

  closePanel() {
    this.showPanel.set(false);
  }

  onDateChange(date: Date | null) {
    if (!date) return;
    this.internalDate.set(date);
    this.dateSelected.emit(date);
    this.closePanel();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.showPanel()) return;
    const target = event.target as Node | null;
    if (target && this.hostRef.nativeElement.contains(target)) return;
    this.closePanel();
  }
}
