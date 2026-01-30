import { Component, input, output, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import dayjs from 'dayjs';
import { SelectModule } from 'primeng/select';
import { NgIcon } from '@ng-icons/core';
import { TooltipModule } from 'primeng/tooltip';

export interface MonthPeriodOption {
  label: string;
  value: string;
  startDate: Date;
  endDate: Date;
}

export interface PeriodRange {
  startDate: Date;
  endDate: Date;
  periodType: string;
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

@Component({
  selector: 'fuse-period-month',
  imports: [CommonModule, FormsModule, SelectModule, NgIcon, TooltipModule],
  templateUrl: './period-month.component.html',
  styleUrls: ['./period-month.component.scss'],
})
export default class PeriodMonthComponent implements OnInit {
  placeholder = input<string>('Selecione o mês');
  disabled = input<boolean>(false);
  storeKey = input<string>('period_month_selector');
  firstEmit = input<boolean>(true);
  tooltip = input<string>('');
  tooltipPosition = input<'top' | 'left' | 'right' | 'bottom'>('bottom');

  periodChange = output<PeriodRange>();

  /** Últimos 12 meses incluindo o atual: startDate = primeiro dia do mês, endDate = último dia do mês */
  monthOptions = computed<MonthPeriodOption[]>(() => {
    const options: MonthPeriodOption[] = [];
    const now = dayjs();

    for (let i = 0; i < 12; i++) {
      const monthDate = now.subtract(i, 'month');
      const startDate = monthDate.startOf('month').toDate();
      const endDate = monthDate.endOf('month').toDate();
      const value = monthDate.format('YYYY-MM');
      const monthName = MONTH_NAMES[monthDate.month()];
      const year = monthDate.year();
      const label = `${monthName} ${year}`;

      options.push({ label, value, startDate, endDate });
    }

    return options;
  });

  selectedValue: string | null = null;

  ngOnInit() {
    const stored = localStorage.getItem(this.storeKey());
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as PeriodRange;
        const value = dayjs(parsed.startDate).format('YYYY-MM');
        const exists = this.monthOptions().some(o => o.value === value);
        if (exists) {
          this.selectedValue = value;
          if (this.firstEmit()) {
            this.emitRange(value);
          }
          return;
        }
      } catch {
        // ignore invalid stored value
      }
    }

    // padrão: mês atual
    const current = dayjs().format('YYYY-MM');
    this.selectedValue = current;
    if (this.firstEmit()) {
      this.emitRange(current);
    }
  }

  onMonthChange(value: string | null) {
    if (!value) return;
    this.selectedValue = value;
    this.emitRange(value);
  }

  private emitRange(value: string): void {
    const option = this.monthOptions().find(o => o.value === value);
    if (!option) return;

    const range: PeriodRange = {
      startDate: option.startDate,
      endDate: option.endDate,
      periodType: value,
    };
    localStorage.setItem(this.storeKey(), JSON.stringify(range));
    this.periodChange.emit(range);
  }
}
