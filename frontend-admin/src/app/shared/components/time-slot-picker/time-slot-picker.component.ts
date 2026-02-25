import { Component, computed, input, output, viewChild, afterNextRender, ElementRef, signal, effect } from '@angular/core';
import { getHorariosByInterval } from 'app/shared/constants/horarios';
import dayjs from 'dayjs';
import { ButtonModule } from 'primeng/button';

export type TimeSlotInterval = 15 | 30 | 60;

@Component({
  selector: 'fuse-time-slot-picker',
  imports: [ButtonModule],
  templateUrl: './time-slot-picker.component.html',
  styleUrl: './time-slot-picker.component.scss',
})
export class TimeSlotPickerComponent {
  private scrollRef = viewChild<ElementRef<HTMLElement>>('scrollContainer');

  /** Intervalo entre slots em minutos: 15, 30 ou 60 */
  interval = input<TimeSlotInterval>(15);

  /** Valor inicial para scroll (ex: "09:00") */
  value = input<string | null>(null);

  /** Se true, mostra rótulos de período (Manhã / Tarde / Noite) */
  showPeriodLabels = input<boolean>(true);

  _timeSelected = signal<string | null>(null);
  timeSelected = output<string>();

  showTimeSlots = signal(false);

  slots = computed(() => {
    const intervalMin = this.interval();
    const list = getHorariosByInterval(intervalMin);
    return list.map((time) => ({
      time,
    }));
  });


  constructor() {
    afterNextRender(() => this.scrollToValue());
  
    if (!this.value()) {
      const data = dayjs().format('HH:mm');
      console.log(data);
    }

    // quando abrir o time slots, scroll para o valor inicial
    effect(() => {
      if (this.showTimeSlots()) {
        console.log('scroll to value');
        this.scrollToValue();
      }
    });

  }

  selectSlot(slot: { time: string }, event?: KeyboardEvent) {
    event?.stopPropagation();
    event?.preventDefault();
    
    this._timeSelected.set(slot.time);
    this.timeSelected.emit(slot.time);
    this.hideTimeSlots();
  }

  openTimeSlots() {
    this.showTimeSlots.set(true);
  }

  hideTimeSlots() {
    this.showTimeSlots.set(false);
  }

  private scrollToValue(): void {
    const val = this._timeSelected();
    if (!val) return;
    const elRef = this.scrollRef();
    const el = elRef?.nativeElement;
    if (!el) return;
    const slot = el.querySelector(`[data-time="${val}"]`);
    if (slot) {
      (slot as HTMLElement).scrollIntoView({ block: 'nearest', behavior: 'auto' });
    }
  }
}
