import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { NgIcon } from '@ng-icons/core';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/dashboard/modules/user-module/user.service';
import { ToastService } from 'app/shared/services/toast.service';
import { SettingsModalService } from './settings-modal.service';

type SettingsTab = 'profile' | 'integrations' | 'notifications' | 'security';

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

  profileForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    username: [''],
    email: ['', [Validators.required, Validators.email]],
  });

  avatarUrl = signal(
    'https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png',
  );

  tabs: TabItem[] = [
    { id: 'profile', label: 'Perfil', icon: 'lucideUser' },
    { id: 'integrations', label: 'Integrações', icon: 'lucideSettings2' },
    { id: 'notifications', label: 'Notificações', icon: 'lucideBell' },
    { id: 'security', label: 'Segurança', icon: 'lucideShield' },
  ];

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  onShow(): void {
    this.activeTab.set('profile');
    this.loadCurrentUser();
  }

  selectTab(tab: SettingsTab): void {
    this.activeTab.set(tab);
  }

  onSave(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
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

    const { fullName, email } = this.profileForm.getRawValue();

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
      this.profileForm.patchValue({
        fullName: decoded.fullName || decoded.name || '',
        username: decoded.username || decoded.email?.split('@')[0] || '',
        email: decoded.email || '',
      });
    }
  }
}
