import { NgModule } from '@angular/core';
import { SelectComponent } from './select/select.component';
import { DatePickerComponent } from './datepicker/datepicker.component';
import { InputComponent } from './input/input.component';

@NgModule({
  imports: [SelectComponent, DatePickerComponent, InputComponent],
  exports: [SelectComponent, DatePickerComponent, InputComponent],
})
export class FormModule {}
