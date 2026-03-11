import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  ViewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { NgIcon } from '@ng-icons/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

export const modalBackdropAnimation = trigger('backdropEnter', [
  transition(':enter', [style({ opacity: 0 }), animate('200ms ease-out', style({ opacity: 1 }))]),
]);

export const modalContentAnimation = trigger('contentEnter', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.96) translateY(-8px)' }),
    animate('250ms ease-out', style({ opacity: 1, transform: 'scale(1) translateY(0)' })),
  ]),
]);

@Component({
  selector: 'fuse-modal',
  imports: [NgIcon, ButtonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  animations: [modalBackdropAnimation, modalContentAnimation],
})
export class ModalComponent implements AfterViewInit, OnDestroy {
  private readonly doc = inject(DOCUMENT, { optional: true });
  private readonly router = inject(Router);
  @ViewChild('backdrop') private readonly backdropRef!: ElementRef<HTMLElement>;

  readonly title = input<string>('');
  readonly subtitle = input<string>('');
  readonly icon = input<string>('');
  readonly titleId = input<string>('modal-title');
  readonly closeOnBackdropClick = input<boolean>(true);
  readonly closeRequested = output<void>();

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
    this.closeRequested.emit();
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
