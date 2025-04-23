import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FormModule } from '../../shared/components/form/form.module';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { emailAsyncValidator } from '../../shared/validators/validators';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AuthResponse } from '../../shared/interfaces/auth.interfaces';
import { translate } from '../../shared/constants/deParaTextos';

@Component({
  selector: 'fuse-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ButtonModule, FormModule, ReactiveFormsModule, MessageModule],
  providers: [],
})
export class LoginComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });


  loading = signal(false);
  errorMessage = signal('');

  constructor() {
    this.form.get('email')?.addAsyncValidators(emailAsyncValidator);
  }

  ngOnInit() {}

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const { email, password } = this.form.getRawValue();
      this.loading.set(true);
      this.authService.login(email!, password!).subscribe({
        next: (res: AuthResponse) => {
          this.authService.setToken(res?.accessToken);
          this.router.navigate(['dashboard']);
          this.loading.set(false);
        },
        error: ({error}: any) => {
          this.errorMessage.set(translate(error?.descricao));
          this.loading.set(false);
        },
      });
    }
  }
}
