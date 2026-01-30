import { Component, input } from '@angular/core';
import { NgClass, CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'fuse-simple-indicator',
  imports: [NgClass, NgIcon, SkeletonModule, CommonModule],
  templateUrl: './simple-indicator.component.html',
  styleUrls: ['./simple-indicator.component.scss'],
})
export default class SimpleIndicatorComponent {
  title = input<string>();
  value = input<string | number>();
  variant = input<'success' | 'warning' | 'error' | 'info'>('info');
  icon = input<string | undefined>();
  customIconSvg = input<string | undefined>();
  loading = input<boolean>(false);
  truncateValue = input<boolean>(false);
  tooltipValue = input<string | undefined>();
  /** Quando true, usa fonte menor (para valores em texto em vez de números) */
  smallValue = input<boolean>(false);

  get variantClasses() {
    const variants = {
      success: {
        textColor: 'text-green-600',
        bgColor: 'bg-green-100',
        iconColor: 'text-green-600',
      },
      warning: {
        textColor: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
      },
      error: {
        textColor: 'text-red-600',
        bgColor: 'bg-red-100',
        iconColor: 'text-red-600',
      },
      info: {
        textColor: 'text-blue-600',
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600',
      },
    };
    return variants[this.variant()];
  }
}
