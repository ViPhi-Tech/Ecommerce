import { Component, EventEmitter, input, InputSignal, OnInit, Output, signal } from '@angular/core';
import { randomId } from '../../../utils/utils';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { SkeletonModule } from 'primeng/skeleton';
import { RadioButtonModule } from 'primeng/radiobutton';
import { NgClass } from '@angular/common';

@Component({
  selector: 'fuse-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  imports: [
    NgClass,
    InputTextModule,
    ReactiveFormsModule,
    PasswordModule,
    MessageModule,
    TextareaModule,
    InputNumberModule,
    RadioButtonModule,
    SkeletonModule,
  ],
})
export class InputComponent implements OnInit {
  control: InputSignal<any> = input(new FormControl());

  label = input<string>('');
  type = input<string>('text');
  placeholder = input<string>('');
  addictionalClass = input<string>('');
  items = input<any[]>([]);
  size = input<'large' | 'small'>('small');
  labelPosition = input<'top' | 'left'>('top');
  radioDirection = input<'row' | 'col'>('row');

  step = input<string | number>(1);

  rows = input<number>(3);

  idRef = signal('input_' + randomId());

  min = input<number>(0);
  max = input<number>(Number.MAX_SAFE_INTEGER);

  isRequired = signal(false);
  isLoading = input<boolean>(false);
  feedback = input<boolean>(false);
  errorMessage = input<string>('');

  @Output() blurInput = new EventEmitter<any>();
  constructor() {}

  ngOnInit() {
    this.isRequired.set(!!this.control()?.validator);
  }

  blurInputComponent(value: any) {
    this.blurInput.emit(value);
  }
}
