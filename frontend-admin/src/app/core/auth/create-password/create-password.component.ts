import {
  Component,
  HostListener,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { NgIcon } from '@ng-icons/core';
import { AuthService } from '../auth.service';
import { translate } from 'app/shared/constants/deParaTextos';

@Component({
  selector: 'fuse-create-password',
  templateUrl: './create-password.component.html',
  styleUrls: ['./create-password.component.scss'],
  imports: [ButtonModule, ReactiveFormsModule, MessageModule, NgIcon],
})
export class CreatePasswordComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form = this.formBuilder.group({
    novaSenha: ['', [Validators.required, Validators.minLength(6)]],
    confirmarSenha: ['', [Validators.required]],
  });

  loading = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  token = signal<string | null>(null);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    this.token.set(token);
    if (!token) {
      this.errorMessage.set('Link inválido ou expirado. Solicite um novo e-mail.');
    }
  }

  @HostListener('keydown.enter', ['$event'])
  onEnterKey(event: Event): void {
    if (event instanceof KeyboardEvent) {
      event.preventDefault();
      this.onSubmit();
    }
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    const token = this.token();
    if (!token) return;

    const { novaSenha, confirmarSenha } = this.form.getRawValue();
    if (novaSenha !== confirmarSenha) {
      this.errorMessage.set('As senhas não coincidem.');
      return;
    }

    if (this.form.invalid) return;

    this.loading.set(true);
    this.errorMessage.set('');

    this.authService
      .createPassword(token, novaSenha!)
      .subscribe({
        next: (res: any) => {
          if (res?.accessToken) {
            this.authService.setToken(res.accessToken);
            this.router.navigate(['dashboard']);
          } else {
            this.router.navigate(['auth', 'login']);
          }
          this.loading.set(false);
        },
        error: ({ error }: any) => {
          this.errorMessage.set(translate(error?.message || 'Erro ao definir senha. Tente novamente.'));
          this.loading.set(false);
        },
      });
  }

  goToLogin(): void {
    this.router.navigate(['auth', 'login']);
  }
}
