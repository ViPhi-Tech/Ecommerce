import { Component, computed, input } from '@angular/core';
import { EmptyStateComponent } from 'app/shared/components/empty-state/empty-state.component';

export interface Indicator {
  title: string;
  value: string;
  trend: 'up' | 'down';
  icon: string;
}

@Component({
  selector: 'fuse-indicators',
  imports: [EmptyStateComponent],
  templateUrl: './indicators.component.html',
  styleUrl: './indicators.component.scss',
})
export class IndicatorsComponent {
  indicators = input<Indicator[]>([]);
  loading = input<boolean>(false);

  hasData = computed<boolean>(() => {
    return this.indicators().length > 0;
  });
}
