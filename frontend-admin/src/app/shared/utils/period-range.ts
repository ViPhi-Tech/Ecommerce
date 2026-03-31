import dayjs from 'dayjs';

export type PeriodPreset =
  | 'today'
  | 'yesterday'
  | 'last7days'
  | 'last15days'
  | 'last30days'
  | 'currentMonth'
  | 'all';

/** Preset keys plus `custom` when the user picks a range in the calendar. */
export type PeriodType = PeriodPreset | 'custom';

export interface PeriodRange {
  startDate: Date;
  endDate: Date;
  periodType: string;
  firstEmit?: boolean;
}

export function buildPeriodRange(periodType: PeriodPreset): PeriodRange {
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
