import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'fuse-simple-indicator',
  imports: [NgClass, NgIcon],
  templateUrl: './simple-indicator.component.html',
  styleUrls: ['./simple-indicator.component.scss'],
})
export default class SimpleIndicatorComponent {
  @Input() title = '';
  @Input() value: string | number = '';
  @Input() variant: 'success' | 'warning' | 'error' | 'info' = 'info';
  @Input() icon?: string;
  @Input() customIconSvg?: string;

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
    return variants[this.variant];
  }
}
