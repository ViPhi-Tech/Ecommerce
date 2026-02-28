import { Component, computed, input, output, viewChild, afterNextRender, ElementRef, signal, effect, inject, HostListener } from '@angular/core';
import { getHorariosByInterval, getNextHorario } from 'app/shared/constants/horarios';
import dayjs from 'dayjs';
import { ButtonModule } from 'primeng/button';

export type TimeSlotInterval = 15 | 30 | 60;

@Component({
  selector: 'fuse-time-slot-picker',
  imports: [ButtonModule],
  templateUrl: './time-slot-picker.component.html',
  styleUrl: './time-slot-picker.component.scss',
  host: { class: 'fuse-time-slot-picker-host' },
})
export class TimeSlotPickerComponent {
  private scrollRef = viewChild<ElementRef<HTMLElement>>('scrollContainer');
  private hostRef = inject(ElementRef);

  /** Intervalo entre slots em minutos: 15, 30 ou 60 */
  interval = input<TimeSlotInterval>(15);

  /** Valor inicial para scroll (ex: "09:00") */
  value = input<string | null>(null);

  /** Se true, mostra rótulos de período (Manhã / Tarde / Noite) */
  showPeriodLabels = input<boolean>(true);

  /** Texto do botão quando nenhum horário está selecionado */
  placeholder = input<string>('Horário');

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
      const nextHorario = getNextHorario(data, this.interval());
      if (nextHorario) {
        this._timeSelected.set(nextHorario.start);
        this.timeSelected.emit(nextHorario.start);
      }
    }

    // quando abrir o time slots, scroll para o valor inicial
    effect(() => {
      if (this.showTimeSlots()) {
        this.scrollToValue();
      }
    });

    // sincroniza value() do parent com _timeSelected para exibir no botão
    effect(() => {
      const v = this.value();
      if (v != null) this._timeSelected.set(v);
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
    console.log('val', val);
    if (!val) return;
    const elRef = this.scrollRef();
    const el = elRef?.nativeElement;
    if (!el) return;
    const slot = el.querySelector(`[data-time="${val}"]`);
    if (slot) {
      (slot as HTMLElement).scrollIntoView({ block: 'nearest', behavior: 'auto' });
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.showTimeSlots()) return;
    const target = event.target as Node | null;
    if (target && this.hostRef.nativeElement.contains(target)) return;
    this.hideTimeSlots();
  }
}
