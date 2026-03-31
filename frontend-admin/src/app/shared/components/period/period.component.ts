import { Component, input, output, OnInit, computed } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { NgIcon } from '@ng-icons/core';
import { TooltipModule } from 'primeng/tooltip';
import {
  buildPeriodRange,
  type PeriodRange,
  type PeriodType,
  type PeriodPreset,
} from 'app/shared/utils/period-range';

export type { PeriodRange, PeriodType, PeriodPreset } from 'app/shared/utils/period-range';

export interface PeriodOption {
  label: string;
  value: string;
  disabled?: boolean;
}

@Component({
  selector: 'fuse-period',
  imports: [FormsModule, SelectModule, NgIcon, TooltipModule],
  templateUrl: './period.component.html',
  styleUrls: ['./period.component.scss'],
})
export default class PeriodComponent implements OnInit {
  // Inputs
  availablePeriods = input<PeriodPreset[]>([
    'today',
    'yesterday',
    'last7days',
    'last15days',
    'last30days',
    'currentMonth',
    'all',
  ]);
  placeholder = input<string>('Selecione o período');
  disabled = input<boolean>(false);
  defaultValue = input<PeriodPreset | undefined>(undefined);
  storeKey = input<string>('period_selector');
  allowStore = input<boolean>(true);
  size = input<string>('small');
  firstEmit = input<boolean>(true);
  tooltip = input<string>('');
  tooltipPosition = input<'top' | 'left' | 'right' | 'bottom'>('bottom');

  // Outputs
  periodChange = output<PeriodRange>();

  // Retorna apenas as opções permitidas
  periodOptions = computed<PeriodOption[]>(() => {
    return this.availablePeriods()
      .map(period => this.allOptions[period])
      .filter(option => option !== undefined);
  });

  selectedPeriod: PeriodType | undefined;

  // Todas as opções disponíveis (custom só para exibir valor ao restaurar do storage)
  private allOptions: Record<PeriodType, PeriodOption> = {
    today: { label: 'Hoje', value: 'today' },
    yesterday: { label: 'Ontem', value: 'yesterday' },
    last7days: { label: 'Últimos 7 dias', value: 'last7days' },
    last15days: { label: 'Últimos 15 dias', value: 'last15days' },
    last30days: { label: 'Últimos 30 dias', value: 'last30days' },
    currentMonth: { label: 'Mês atual', value: 'currentMonth' },
    all: { label: 'Todos', value: 'all' },
    custom: { label: 'Personalizado', value: 'custom' },
  };

  ngOnInit() {
    const storedPeriod = localStorage.getItem(this.storeKey());
    if (storedPeriod && this.allowStore()) {
      const parsed = JSON.parse(storedPeriod) as PeriodRange & {
        startDate: string;
        endDate: string;
      };
      this.selectedPeriod = parsed.periodType as PeriodType;
      if (this.firstEmit()) {
        if (parsed.periodType === 'custom') {
          this.periodChange.emit({
            startDate: new Date(parsed.startDate),
            endDate: new Date(parsed.endDate),
            periodType: 'custom',
            firstEmit: true,
          });
        } else {
          this.onPeriodChange(this.selectedPeriod as PeriodPreset, true);
        }
      }
    } else if (this.defaultValue()) {
      this.selectedPeriod = this.defaultValue();
      if (this.firstEmit()) {
        this.onPeriodChange(this.selectedPeriod as PeriodPreset, true);
      }
    } else {
      this.selectedPeriod = 'today';
      if (this.firstEmit()) {
        this.onPeriodChange(this.selectedPeriod as PeriodPreset, true);
      }
    }
  }

  onPeriodChange(periodType: string | undefined, firstEmit = false) {
    if (!periodType || periodType === 'custom') return;
    const range = buildPeriodRange(periodType as PeriodPreset);
    localStorage.setItem(this.storeKey(), JSON.stringify(range));
    this.periodChange.emit({
      ...range,
      firstEmit,
    });
  }

  /** Usado pelo pai ao definir intervalo pelo calendário; mantém o select alinhado. */
  setCustomPeriod(startDate: Date, endDate: Date): void {
    this.selectedPeriod = 'custom';
    const range: PeriodRange = {
      startDate,
      endDate,
      periodType: 'custom',
    };
    localStorage.setItem(this.storeKey(), JSON.stringify(range));
    this.periodChange.emit(range);
  }
}
