import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageModule } from 'primeng/message';

import { NgIcon } from '@ng-icons/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormModule } from 'app/shared/components/form/form.module';
import { emailAsyncValidator } from 'app/shared/validators/validators';
import { translate } from 'app/shared/constants/deParaTextos';
import {
  AuthResponse,
  ChangePasswordRequest,
} from 'app/shared/interfaces/auth.interfaces';

@Component({
  selector: 'fuse-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    ButtonModule,
    FormModule,
    ReactiveFormsModule,
    MessageModule,
    NgIcon
],
  providers: [],
})
export class LoginComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
    novaSenha: [''],
    confirmarSenha: [''],
  });

  loading = signal(false);
  errorMessage = signal('');
  primeiroLogin = signal(false);
  userEmail = signal('');
  showPassword = signal(false);

  constructor() {
    this.form.get('email')?.addAsyncValidators(emailAsyncValidator);
  }

  ngOnInit() {}

  @HostListener('keydown.enter', ['$event'])
  onEnterKey(event: Event) {
    if (event instanceof KeyboardEvent) {
      event.preventDefault();
      this.onSubmit();
    }
  }

  onSubmit() {
    this.form.markAllAsTouched();

    if (this.primeiroLogin()) {
      // Lógica para mudança de senha no primeiro login
      this.changePassword();
    } else {
      // Lógica de login normal
      this.performLogin();
    }
  }

  private performLogin() {
    if (this.form.get('email')?.valid && this.form.get('password')?.valid) {
      const { email, password } = this.form.getRawValue();
      this.loading.set(true);
      this.authService.login(email!, password!).subscribe({
        next: (res: AuthResponse) => {
          if (res.primeiroLogin) {
            // É o primeiro login, habilitar campos de nova senha
            this.primeiroLogin.set(true);
            this.userEmail.set(email!);
            this.setupPasswordChangeValidators();
            this.loading.set(false);
          } else {
            // Login normal
            this.authService.setToken(res?.accessToken);
            this.router.navigate(['dashboard']);
            this.loading.set(false);
          }
        },
        error: ({ error }: any) => {
          this.errorMessage.set(translate(error?.descricao));
          this.loading.set(false);
        },
      });
    }
  }

  private changePassword() {
    if (
      this.form.get('novaSenha')?.valid &&
      this.form.get('confirmarSenha')?.valid
    ) {
      const { novaSenha, confirmarSenha } = this.form.getRawValue();

      if (novaSenha !== confirmarSenha) {
        this.errorMessage.set('As senhas não coincidem');
        return;
      }

      this.loading.set(true);
      const changePasswordData: ChangePasswordRequest = {
        email: this.userEmail(),
        novaSenha: novaSenha!,
        confirmarSenha: confirmarSenha!,
      };

      this.authService.changePassword(changePasswordData).subscribe({
        next: (res: any) => {
          // Após trocar a senha, fazer login automaticamente
          this.authService.setToken(res?.accessToken);
          this.router.navigate(['dashboard']);
          this.loading.set(false);
        },
        error: ({ error }: any) => {
          this.errorMessage.set(translate(error?.descricao));
          this.loading.set(false);
        },
      });
    }
  }

  private setupPasswordChangeValidators() {
    this.form
      .get('novaSenha')
      ?.setValidators([Validators.required, Validators.minLength(6)]);
    this.form.get('confirmarSenha')?.setValidators([Validators.required]);
    this.form.get('novaSenha')?.updateValueAndValidity();
    this.form.get('confirmarSenha')?.updateValueAndValidity();
  }

  voltarParaLogin() {
    this.primeiroLogin.set(false);
    this.errorMessage.set('');
    this.form.get('novaSenha')?.clearValidators();
    this.form.get('confirmarSenha')?.clearValidators();
    this.form.get('novaSenha')?.updateValueAndValidity();
    this.form.get('confirmarSenha')?.updateValueAndValidity();
    this.form.patchValue({
      novaSenha: '',
      confirmarSenha: '',
    });
  }
}
