import { Component, input, InputSignal, OnInit, signal } from '@angular/core';
import { randomId } from '../../../utils/utils';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'fuse-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  imports: [
    InputTextModule,
    ReactiveFormsModule,
    PasswordModule,
    MessageModule,
    TextareaModule,
    InputNumberModule,
  ],
})
export class InputComponent implements OnInit {
  control: InputSignal<any> = input(new FormControl());

  label = input<string>('');
  type = input<string>('text');
  placeholder = input<string>('');
  addictionalClass = input<string>('');
  size = input<'large' | 'small'>('small');
  labelPosition = input<'top' | 'left'>('top');

  step = input<string | number>(1);
  feedback = input<boolean>(false);
  errorMessage = input<string>('');

  rows = input<number>(3);

  idRef = signal('input_' + randomId());

  constructor() {}

  ngOnInit() {}
}
