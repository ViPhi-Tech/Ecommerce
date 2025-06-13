import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toast = inject(MessageService);

  constructor() {}

  success(message: string): void {
    this.toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: message,
    });
  }

  error(message: string): void {
    this.toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: message,
    });
  }

  info(message: string): void {
    this.toast.add({
      severity: 'info',
      summary: 'Informação',
      detail: message,
    });
  }
  warn(message: string): void {
    this.toast.add({
      severity: 'warn',
      summary: 'Aviso',
      detail: message,
    });
  }
  clear(): void {
    this.toast.clear();
  }
}
