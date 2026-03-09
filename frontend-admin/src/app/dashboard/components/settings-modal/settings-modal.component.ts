import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
  settingsModal = inject(SettingsModalService);

  activeTab = signal<SettingsTab>('profile');
  isLoading = signal(false);

  settingsForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    username: [''],
    email: ['', [Validators.required, Validators.email]],
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
    this.loadCurrentUser();
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
    if (decoded) {
      this.settingsForm.patchValue({
        fullName: decoded.fullName || decoded.name || '',
        username: decoded.username || decoded.email?.split('@')[0] || '',
        email: decoded.email || '',
      });
    }
  }
}
