import {
  Component,
  EventEmitter,
  input,
  InputSignal,
  OnInit,
  Output,
  signal,
} from '@angular/core';
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
import { InputMaskModule } from 'primeng/inputmask';
import { NgxMaskDirective } from 'ngx-mask';

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
    InputMaskModule,
    NgxMaskDirective,
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
  mask = input<string>('');

  isRequired = signal(false);
  isLoading = input<boolean>(false);
  feedback = input<boolean>(false);
  errorMessage = input<string>('');

  @Output() blurChange = new EventEmitter<any>();
  @Output() inputChange = new EventEmitter<any>();
  @Output() keydownChange = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {
    this.checkIsRequired();
  }

  checkIsRequired() {
    const ctrl = this.control();
    if (!ctrl?.validator) {
      this.isRequired.set(false);
    } else {
      const emptyControl = new FormControl(null);
      const result = ctrl.validator(emptyControl as any);
      this.isRequired.set(!!result?.['required']);
    }
  }

  blurChangeComponent(value: any) {
    this.blurChange.emit(value);
  }

  inputChangeComponent(value: any) {
    this.inputChange.emit(value);
  }

  keydownChangeComponent(value: any) {
    this.keydownChange.emit(value);
  }
}
