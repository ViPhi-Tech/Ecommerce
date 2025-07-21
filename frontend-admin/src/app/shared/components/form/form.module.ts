import { NgModule } from '@angular/core';
import { SelectComponent } from './select/select.component';
import { DatePickerComponent } from './datepicker/datepicker.component';
import { InputComponent } from './input/input.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    SelectComponent,
    DatePickerComponent,
    InputComponent,
    ReactiveFormsModule,
  ],
  exports: [SelectComponent, DatePickerComponent, InputComponent],
})
export class FormModule {}
