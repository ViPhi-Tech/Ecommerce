import { Injectable, signal } from '@angular/core';

export type UserMessageIntent = 'info' | 'success' | 'warning' | 'error';

export interface UserMessageConfig {
  title?: string;
  description?: string;
  icon?: string;
  intent?: UserMessageIntent;
  primaryLabel?: string;
  showSecondary?: boolean;
  secondaryLabel?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserMessageDialogService {
  visible = signal(false);
  title = signal('Mensagem');
  description = signal<string | null>(null);
  icon = signal('lucideInfo');
  intent = signal<UserMessageIntent>('info');
  primaryLabel = signal('Ok, entendi');
  showSecondary = signal(false);
  secondaryLabel = signal('Cancelar');

  open(config: UserMessageConfig): void {
    this.title.set(config.title ?? 'Mensagem');
    this.description.set(config.description ?? null);
    this.icon.set(config.icon ?? 'lucideInfo');
    this.intent.set(config.intent ?? 'info');
    this.primaryLabel.set(config.primaryLabel ?? 'Ok, entendi');
    this.showSecondary.set(config.showSecondary ?? false);
    this.secondaryLabel.set(config.secondaryLabel ?? 'Cancelar');
    this.visible.set(true);
  }

  close(): void {
    this.visible.set(false);
  }
}

