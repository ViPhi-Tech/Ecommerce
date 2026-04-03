import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { NgIcon } from '@ng-icons/core';
import { InputComponent } from 'app/shared/components/form/input/input.component';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/dashboard/modules/user-module/user.service';
import { ToastService } from 'app/shared/services/toast.service';
import { SettingsModalService } from './settings-modal.service';

/** Corpo retornado por GET /user/:id (perfil + login aninhado) */
interface SettingsUserFromApi {
  fullName?: string;
  login?: { email?: string | null };
}

type SettingsTab = 'profile' | 'integrations' | 'email' | 'security';

interface TabItem {
  id: SettingsTab;
  label: string;
  icon: string;
}

@Component({
  selector: 'fuse-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    InputComponent,
    NgIcon,
  ],
})
export class SettingsModalComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  settingsModal = inject(SettingsModalService);

  activeTab = signal<SettingsTab>('profile');
  isLoading = signal(false);

  settingsForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    username: [''],
    email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
    wantDailyReports: [false],
    dailyReportsEmail: [{ value: '', disabled: true }],
  });

  avatarUrl = signal(
    'https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png',
  );

  tabs: TabItem[] = [
    { id: 'profile', label: 'Perfil', icon: 'lucideUser' },
    { id: 'integrations', label: 'Integrações', icon: 'lucideSettings2' },
    { id: 'email', label: 'Envio de E-mail', icon: 'lucideMail' },
    { id: 'security', label: 'Segurança', icon: 'lucideShield' },
  ];

  ngOnInit(): void {
    this.settingsForm.get('wantDailyReports')?.valueChanges?.subscribe((v) =>
      this.onDailyReportsToggle(!!v),
    );
  }

  onShow(): void {
    this.activeTab.set('profile');
    this.loadCurrentUser();
  }

  selectTab(tab: SettingsTab): void {
    this.activeTab.set(tab);
  }

  onDailyReportsToggle(checked: boolean): void {
    const emailControl = this.settingsForm.get('dailyReportsEmail');
    if (!emailControl) return;
    if (checked) {
      emailControl.enable();
      emailControl.setValidators([Validators.required, Validators.email]);
    } else {
      emailControl.disable();
      emailControl.clearValidators();
      emailControl.setValue('');
    }
    emailControl.updateValueAndValidity();
  }

  onSave(): void {
    if (this.settingsForm.invalid) {
      this.settingsForm.markAllAsTouched();
      this.toast.warn('Preencha os campos obrigatórios.');
      return;
    }

    this.isLoading.set(true);
    const decoded = this.authService.getDecodedToken();
    const userId = decoded?.sub || decoded?.id;

    if (!userId) {
      this.toast.error('Não foi possível identificar o usuário.');
      this.isLoading.set(false);
      return;
    }

    const { fullName, email } = this.settingsForm.getRawValue();

    this.userService
      .upsertUser({
        id: userId,
        fullName: fullName?.trim(),
        email: email?.trim(),
      })
      .subscribe({
        next: () => {
          this.toast.success('Perfil atualizado com sucesso!');
          this.isLoading.set(false);
          this.settingsModal.close();
        },
        error: () => {
          this.toast.error('Erro ao atualizar perfil.');
          this.isLoading.set(false);
        },
      });
  }

  onCancel(): void {
    this.settingsModal.close();
  }

  onChangePhoto(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.avatarUrl.set(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }

  onRemovePhoto(): void {
    this.avatarUrl.set(
      'https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png',
    );
  }

  private loadCurrentUser(): void {
    const decoded = this.authService.getDecodedToken();
    const userIdRaw = decoded?.sub ?? decoded?.id ?? decoded?.userId;
    const userId = userIdRaw != null ? String(userIdRaw) : null;

    if (!userId) {
      this.applyUserFromJwt(decoded);
      return;
    }

    this.userService
      .getUserById(userId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          const raw = (res.data ?? res.dados ?? res) as SettingsUserFromApi | null;
          if (!raw || typeof raw !== 'object' || !('fullName' in raw)) {
            this.applyUserFromJwt(decoded);
            return;
          }
          const email = raw.login?.email?.trim() ?? '';
          const emailCtrl = this.settingsForm.get('email');
          emailCtrl?.enable({ emitEvent: false });
          this.settingsForm.patchValue(
            {
              fullName: raw.fullName ?? '',
              email,
            },
            { emitEvent: false },
          );
          emailCtrl?.disable({ emitEvent: false });
        },
        error: () => {
          this.applyUserFromJwt(decoded);
          this.toast.warn('Não foi possível carregar o perfil. Exibindo dados da sessão.');
        },
      });
  }

  private applyUserFromJwt(decoded: Record<string, unknown> | null): void {
    if (!decoded) return;
    const email = (decoded['email'] as string) || '';
    const emailCtrl = this.settingsForm.get('email');
    emailCtrl?.enable({ emitEvent: false });
    this.settingsForm.patchValue(
      {
        fullName: (decoded['fullName'] as string) || (decoded['name'] as string) || '',
        username: this.usernameFromJwt(decoded),
        email,
      },
      { emitEvent: false },
    );
    emailCtrl?.disable({ emitEvent: false });
  }

  private usernameFromJwt(decoded: Record<string, unknown> | null): string {
    if (!decoded) return '';
    const u = decoded['username'] as string | undefined;
    if (u) return u;
    const email = decoded['email'] as string | undefined;
    return email?.split('@')[0] ?? '';
  }
}
