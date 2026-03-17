import { ChangeDetectionStrategy, Component, computed, input, InputSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';

type AvatarSize = 'large' | 'xlarge' | 'normal';
type AvatarShape = 'circle' | 'square';

export type AvatarPassThrough = Record<string, unknown>;

export type PassThroughOptions = Record<string, unknown>;

@Component({
  selector: 'fuse-avatar',
  imports: [CommonModule, NgIcon],
  template: `
    <div
      [class]="hostClasses()"
      role="img"
      [attr.aria-label]="ariaLabel() || label() || undefined"
      [attr.aria-labelledby]="ariaLabelledBy() || null"
    >
      @if (image()) {
        <img
          [src]="image()!"
          [alt]="ariaLabel() || label() || ''"
          class="w-full h-full object-cover"
          loading="lazy"
        />
      } @else {
        @if (icon()) {
          <ng-icon [name]="icon()!" size="18"></ng-icon>
        } @else {
          <span class="font-semibold tracking-wide uppercase">
            {{ initials() }}
          </span>
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  readonly label = input<string | null>(null);
  readonly icon = input<string | null>(null);
  readonly image = input<string | null>(null);

  readonly size = input<AvatarSize>('normal');
  readonly shape = input<AvatarShape>('square');

  readonly styleClass = input<string | null>(null);

  readonly ariaLabel = input<string | null>(null);
  readonly ariaLabelledBy = input<string | null>(null);

  readonly dt: InputSignal<object | undefined> = input<object | undefined>(undefined);
  readonly unstyled: InputSignal<boolean | undefined> = input<boolean | undefined>(undefined);
  readonly pt: InputSignal<AvatarPassThrough | undefined> =
    input<AvatarPassThrough | undefined>(undefined);
  readonly ptOptions: InputSignal<PassThroughOptions | undefined> =
    input<PassThroughOptions | undefined>(undefined);

  readonly initials = computed(() => {
    const value = this.label();
    if (!value) {
      return '';
    }

    const words = value
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (!words.length) {
      return '';
    }

    const [first, second] = words;
    if (!second) {
      return first.charAt(0).toUpperCase();
    }

    return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase();
  });

  readonly hostClasses = computed(() => {
    const size = this.size();
    const shape = this.shape();
    const extra = this.styleClass();

    if (this.unstyled()) {
      return extra ?? '';
    }

    const base =
      'inline-flex items-center justify-center overflow-hidden ' +
      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100 ' +
      'ring-1 ring-slate-200/70 dark:ring-slate-700/70 shadow-xs ' +
      'transition-all duration-150 ease-out';

    const sizeClass =
      size === 'large'
        ? 'w-11 h-11 text-base'
        : size === 'xlarge'
          ? 'w-14 h-14 text-lg'
          : 'w-9 h-9 text-sm';

    const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-xl';

    return [base, sizeClass, shapeClass, extra ?? ''].filter(Boolean).join(' ');
  });
}

