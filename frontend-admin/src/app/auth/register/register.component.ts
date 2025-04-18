import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FormModule } from '../../shared/components/form/form.module';

@Component({
  selector: 'fuse-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [ButtonModule, FormModule]
})
export class RegisterComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
