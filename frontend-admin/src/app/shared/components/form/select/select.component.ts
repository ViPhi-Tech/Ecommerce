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
    RouterModule,
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
  drawer = input<any[]>([]);
  drawerAux = input<any[]>([]);

  @Output() changeValue = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {
    this.isRequired.set(!!this.control()?.validator);
  }

  onChange: any = (value: any) => {
    this.changeValue.emit(value);
  };

  redirectToDrawer() {
    if (this.drawerAux().length > 0) {
      // Extract the current drawer outlet from the router URL
      const match = this.router.url.match(/drawer:([^)]*)/);
      const drawer = match && match[1] ? match[1].split('/') : [];
      this.router.navigate([
        { outlets: { drawer: drawer, drawerAux: this.drawerAux() } },
      ]);
      return;
    }
    this.router.navigate([{ outlets: { drawer: this.drawer() } }]);
  }
}
