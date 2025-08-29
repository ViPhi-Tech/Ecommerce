import {
  Component,
  EventEmitter,
  input,
  InputSignal,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'fuse-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  imports: [
    RadioButtonModule,
    ReactiveFormsModule,
    SkeletonModule,
    MessageModule,
  ],
})
export class RadioComponent implements OnInit {
  control: InputSignal<any> = input(new FormControl());

  items: InputSignal<any> = input([]);
  label = input('');
  valueRef = input('value');
  labelRef = input('label');
  labelPosition = input<'top' | 'left'>('top');
  direction = input<'row' | 'col'>('row');
  size = input<'large' | 'small'>('small');

  addictionalClass = input('');
  groupName = input('radioGroup');

  isRequired = signal(false);
  isLoading = input<boolean>(false);
  errorMessage = input<string>('');

  @Output() changeValue = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {
    this.isRequired.set(!!this.control()?.validator);
  }

  onChange(value: any) {
    this.changeValue.emit(value);
  }
}
