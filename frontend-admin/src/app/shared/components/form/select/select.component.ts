import { Component, input, InputSignal, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'fuse-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  imports: [SelectModule, ReactiveFormsModule],
})
export class SelectComponent implements OnInit {
  control: InputSignal<any> = input(new FormControl());

  items: InputSignal<any> = input([]);
  label = input('');

  placeholder = input('');
  valueRef = input('value');
  labelRef = input('label');
  labelPosition = input('top');
  size = input<'large' | 'small'>('small');

  addictionalPrimeClass = input('w-full');
  addictionalClass = input('');

  constructor() {}

  ngOnInit() {}

  onChange: any = () => {};
}
