import { Component, input, InputSignal, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { randomId } from '../../../utils/utils';
import dayjs from 'dayjs';

@Component({
  selector: 'fuse-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  imports: [DatePickerModule, ReactiveFormsModule],
})
export class DatePickerComponent implements OnInit {
  control: InputSignal<any> = input(new FormControl());

  label = input('');
  type = input('date');
  placeholder = input('');
  addictionalClass = input('');
  addictionalClassPrime = input('');
  labelPosition = input('top');
  size = input<'large' | 'small'>('small');
  maxDate = input<Date | null>(null);

  isLoading = input(false);
  isRequired = signal(false);
  idRef = signal(randomId());

  constructor() {}

  ngOnInit() {
    this.isRequired.set(!!this.control()?.validator);
  }

  onDateSelect(date: Date) {
    if (date) {
      // Converte a data para o formato DD/MM/YYYY
      const formattedDate = dayjs(date).format('DD/MM/YYYY');
      this.control().setValue(formattedDate);
    }
  }

  onTimeSelect(time: Date) {
    if (time) {
      // Converte o horário para o formato HH:mm
      const formattedTime = dayjs(time).format('HH:mm');
      this.control().setValue(formattedTime);
    }
  }

  onChange: any = () => {};
}
