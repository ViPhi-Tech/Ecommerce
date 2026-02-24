import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyStateComponent } from 'app/shared/components/empty-state/empty-state.component';

export interface Indicator {
  title: string;
  value: string;
  trend: 'up' | 'down';
  icon: string;
}

@Component({
  selector: 'fuse-indicators',
  standalone: true,
  imports: [CommonModule, EmptyStateComponent],
  templateUrl: './indicators.component.html',
  styleUrls: ['./indicators.component.scss'],
})
export class IndicatorsComponent {
  @Input() indicators: Indicator[] = [];
  @Input() loading = false;

  // Computed para verificar se há dados
  hasData = computed<boolean>(() => {
    return this.indicators.length > 0;
  });
}
