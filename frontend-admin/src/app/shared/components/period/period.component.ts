import { Component, input, output, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import dayjs from 'dayjs';
import { SelectModule } from 'primeng/select';
import { NgIcon } from '@ng-icons/core';

export interface PeriodOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface PeriodRange {
  startDate: Date;
  endDate: Date;
  periodType: string;
}

export type PeriodType =
  | 'today'
  | 'yesterday'
  | 'last7days'
  | 'last15days'
  | 'last30days'
  | 'currentMonth'
  | 'all';

@Component({
  selector: 'fuse-period',
  imports: [CommonModule, FormsModule, SelectModule, NgIcon],
  templateUrl: './period.component.html',
  styleUrls: ['./period.component.scss'],
})
export default class PeriodComponent implements OnInit {
  // Inputs
  availablePeriods = input<PeriodType[]>([
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
  defaultValue = input<PeriodType | undefined>(undefined);
  storeKey = input<string>('period_selector');
  size = input<string>('small')
  firstEmit = input<boolean>(true);

  // Outputs
  periodChange = output<PeriodRange>();

  // Retorna apenas as opções permitidas
  periodOptions = computed<PeriodOption[]>(() => {
    return this.availablePeriods()
      .map(period => this.allOptions[period])
      .filter(option => option !== undefined);
  });

  selectedPeriod: PeriodType | undefined;

  // Todas as opções disponíveis
  private allOptions: Record<PeriodType, PeriodOption> = {
    today: { label: 'Hoje', value: 'today' },
    yesterday: { label: 'Ontem', value: 'yesterday' },
    last7days: { label: 'Últimos 7 dias', value: 'last7days' },
    last15days: { label: 'Últimos 15 dias', value: 'last15days' },
    last30days: { label: 'Últimos 30 dias', value: 'last30days' },
    currentMonth: { label: 'Mês atual', value: 'currentMonth' },
    all: { label: 'Todos', value: 'all' },
  };

  ngOnInit() {
    const storedPeriod = localStorage.getItem(this.storeKey());
    if (storedPeriod) {
      this.selectedPeriod = JSON.parse(storedPeriod).periodType;
      if (this.firstEmit()) {
        this.onPeriodChange(this.selectedPeriod);
      }
    } else if (this.defaultValue()) {
      this.selectedPeriod = this.defaultValue();
      if (this.firstEmit()) {
        this.onPeriodChange(this.selectedPeriod);
      }
    } else {
      this.selectedPeriod = 'today';
      if (this.firstEmit()) {
        this.onPeriodChange(this.selectedPeriod);
      }
    }
  }

  onPeriodChange(periodType: string | undefined) {
    if (!periodType) return;
    const range = this.calculatePeriodRange(periodType as PeriodType);
    localStorage.setItem(this.storeKey(), JSON.stringify(range));
    this.periodChange.emit(range);
  }

  private calculatePeriodRange(periodType: PeriodType): PeriodRange {
    const now = dayjs();
    let startDate: dayjs.Dayjs;
    let endDate: dayjs.Dayjs;

    switch (periodType) {
      case 'today':
        startDate = now.startOf('day');
        endDate = now.endOf('day');
        break;

      case 'yesterday':
        startDate = now.subtract(1, 'day').startOf('day');
        endDate = now.subtract(1, 'day').endOf('day');
        break;

      case 'last7days':
        startDate = now.subtract(6, 'day').startOf('day');
        endDate = now.endOf('day');
        break;

      case 'last15days':
        startDate = now.subtract(14, 'day').startOf('day');
        endDate = now.endOf('day');
        break;

      case 'last30days':
        startDate = now.subtract(29, 'day').startOf('day');
        endDate = now.endOf('day');
        break;

      case 'currentMonth':
        startDate = now.startOf('month');
        endDate = now.endOf('month');
        break;

      case 'all':
        // Para "todos", usa uma data muito antiga até hoje
        startDate = dayjs('2000-01-01').startOf('day');
        endDate = now.endOf('day');
        break;

      default:
        startDate = now.startOf('day');
        endDate = now.endOf('day');
    }

    return {
      startDate: startDate.toDate(),
      endDate: endDate.toDate(),
      periodType,
    };
  }
}
