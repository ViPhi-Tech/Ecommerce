import { NgModule } from '@angular/core';
import { SelectComponent } from './select/select.component';
import { DatePickerComponent } from './datepicker/datepicker.component';
import { InputComponent } from './input/input.component';
import { RadioComponent } from './radio/radio.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    SelectComponent,
    DatePickerComponent,
    InputComponent,
    RadioComponent,
    ReactiveFormsModule,
  ],
  exports: [
    SelectComponent,
    DatePickerComponent,
    InputComponent,
    RadioComponent,
  ],
})
export class FormModule {}
