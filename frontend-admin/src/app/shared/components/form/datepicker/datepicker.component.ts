import { Component, input, InputSignal, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { randomId } from '../../../utils/utils';

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

  idRef = signal(randomId());

  constructor() {}

  ngOnInit() {}

  onChange: any = () => {};
}
