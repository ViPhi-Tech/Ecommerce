import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgIcon } from '@ng-icons/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

export const modalBackdropAnimation = trigger('backdropEnter', [
  state('open', style({ opacity: 1 })),
  state('closing', style({ opacity: 0 })),
  transition(':enter', [style({ opacity: 0 }), animate('150ms ease-out', style({ opacity: 1 }))]),
  transition('open => closing', [animate('150ms ease-in')]),
]);

export const modalContentAnimation = trigger('contentEnter', [
  state('open', style({ opacity: 1, transform: 'scale(1)' })),
  state('closing', style({ opacity: 0, transform: 'scale(0.85)' })),
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.85)' }),
    animate('300ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ opacity: 1, transform: 'scale(1)' })),
  ]),
  transition('open => closing', [animate('200ms ease-in')]),
]);

@Component({
  selector: 'fuse-modal',
  imports: [NgIcon, ButtonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  animations: [modalBackdropAnimation, modalContentAnimation],
})
export class ModalComponent implements AfterViewInit, OnDestroy {
  // === Injected Dependencies ===
  private readonly doc = inject(DOCUMENT, { optional: true });
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  // === ViewChild References ===
  @ViewChild('backdrop') private readonly backdropRef!: ElementRef<HTMLElement>;

  // === Inputs ===
  readonly title = input<string>('');
  readonly subtitle = input<string>('');
  readonly icon = input<string>('');
  readonly titleId = input<string>('modal-title');
  readonly closeOnBackdropClick = input<boolean>(false);
  readonly maxWidth = input<string>('672px');
  readonly modalInUrl = input<boolean>(false);

  // === Outputs ===
  readonly closeRequested = output<void>();

  // === Signals ===
  readonly closing = signal(false);

  // === Local Variables ===
  private backdropEl: HTMLElement | null = null;

  ngAfterViewInit(): void {
    if (!this.doc || !this.backdropRef?.nativeElement) return;
    this.backdropEl = this.backdropRef.nativeElement;
    this.doc.body.appendChild(this.backdropEl);
  }

  ngOnDestroy(): void {
    if (this.doc && this.backdropEl?.parentNode === this.doc.body) {
      this.doc.body.removeChild(this.backdropEl);
    }
  }

  closeModal(): void {
    this.closing.set(true);
    setTimeout(() => {
      if (this.modalInUrl()) {
        this.router.navigate([{ outlets: { drawer: null } }], {
          relativeTo: this.activatedRoute.root,
        });
      }
      this.closeRequested.emit();
    }, 200);
  }

  onBackdropClick(): void {
    if (!this.closeOnBackdropClick()) {
      return;
    }
    this.closeModal();
  }

  onEscapeKey(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeModal();
    }
  }

  onContentClick(event: Event): void {
    event.stopPropagation();
  }
}
