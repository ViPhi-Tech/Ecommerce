import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Indicator {
  title: string;
  value: string;
  percentage: string;
  trend: 'up' | 'down';
  icon: string;
}

@Component({
  selector: 'fuse-indicators',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './indicators.component.html',
  styleUrls: ['./indicators.component.scss'],
})
export class IndicatorsComponent {
  @Input() indicators: Indicator[] = [];
}
