import {
  Component,
  EventEmitter,
  inject,
  input,
  InputSignal,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'fuse-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  imports: [
    SelectModule,
    ReactiveFormsModule,
    NgIcon,
    ButtonModule,
    SkeletonModule,
    RouterModule
  ],
})
export class SelectComponent implements OnInit {
  private router = inject(Router);

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

  canSearch = input<boolean>(true);
  isRequired = signal(false);
  isLoading = input<boolean>(false);
  quickAdd = input<any[]>([]);

  @Output() changeValue = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {
    this.isRequired.set(!!this.control()?.validator);
  }

  onChange: any = (value: any) => {
    this.changeValue.emit(value);
  };

  redirectToQuickAdd() {
    this.router.navigate([{ outlets: { drawer: this.quickAdd() } }]);
  }
}
