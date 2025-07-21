import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Configurar plugins do dayjs
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('pt-br');

@Pipe({
  name: 'dateCustom',
  standalone: true,
})
export class DateCustomPipe implements PipeTransform {
  transform(
    value: string | number | Date | dayjs.Dayjs,
    format?: string,
    relative?: boolean
  ): string {
    if (!value) {
      return '';
    }

    const date = dayjs(value);

    // Verifica se a data é válida
    if (!date.isValid()) {
      return 'Data inválida';
    }

    // Se relative for true, retorna tempo relativo (ex: "há 2 dias")
    if (relative) {
      return date.fromNow();
    }

    // Formatos predefinidos ou personalizado
    switch (format) {
      case 'short':
        return date.format('DD/MM/YYYY');

      case 'medium':
        return date.format('DD/MM/YYYY HH:mm');

      case 'long':
        return date.format('DD [de] MMMM [de] YYYY');

      case 'full':
        return date.format('dddd, DD [de] MMMM [de] YYYY [às] HH:mm');

      case 'time':
        return date.format('HH:mm');

      case 'datetime':
        return date.format('DD/MM/YYYY [às] HH:mm');

      case 'iso':
        return date.toISOString();

      case 'timestamp':
        return date.unix().toString();

      default:
        // Se um formato personalizado for fornecido, usa ele
        // Senão, usa o formato padrão brasileiro
        return format ? date.format(format) : date.format('DD/MM/YYYY');
    }
  }
}
