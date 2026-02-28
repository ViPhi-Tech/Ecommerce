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
  viewChild,
  Renderer2,
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
  private renderer = inject(Renderer2);
  private buttonRef = viewChild<ElementRef<HTMLButtonElement>>('triggerButton');
  private overlayMovedToBody = false;

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
  /** Posição do painel (para renderizar acima do modal) */
  panelPosition = signal({ top: 0, left: 0 });

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
    const btn = this.buttonRef()?.nativeElement ?? this.hostRef.nativeElement.querySelector('button');
    if (btn) {
      const rect = btn.getBoundingClientRect();
      this.panelPosition.set({ top: rect.bottom + 4, left: rect.left });
    }
    this.showPanel.set(true);
    setTimeout(() => this.moveOverlayToBody(), 0);
  }

  private moveOverlayToBody() {
    const overlay = this.hostRef.nativeElement.querySelector('.date-picker-overlay');
    if (overlay && document.body && !this.overlayMovedToBody) {
      this.renderer.appendChild(document.body, overlay);
      this.overlayMovedToBody = true;
    }
  }

  private moveOverlayBack() {
    const overlay = document.body.querySelector('.date-picker-overlay');
    if (overlay && this.overlayMovedToBody && this.hostRef.nativeElement) {
      this.renderer.appendChild(this.hostRef.nativeElement, overlay);
      this.overlayMovedToBody = false;
    }
  }

  closePanel() {
    this.moveOverlayBack();
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
    if (!target) {
      this.closePanel();
      return;
    }
    if (this.hostRef.nativeElement.contains(target)) return;
    const overlayInBody = document.body.querySelector('.date-picker-overlay');
    if (overlayInBody && overlayInBody.contains(target)) return;
    this.closePanel();
  }
}
