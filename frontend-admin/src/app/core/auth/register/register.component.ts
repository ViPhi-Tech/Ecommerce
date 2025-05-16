import { Component, OnInit } from '@angular/core';
import { FormModule } from 'app/shared/components/form/form.module';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'fuse-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [ButtonModule, FormModule],
})
export class RegisterComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
