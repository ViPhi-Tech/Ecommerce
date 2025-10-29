import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'fuse-accounts-receivable-redirect',
  template: `<div class="flex justify-center items-center h-64">
    <div class="text-center">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"
      ></div>
      <p class="mt-2 text-gray-600 dark:text-gray-400">Carregando...</p>
    </div>
  </div>`,
  standalone: true,
})
export class AccountsReceivableRedirectComponent implements OnInit {
  private router = inject(Router);

  ngOnInit() {
    // Verificar preferência de visualização salva
    // const viewPreference = localStorage.getItem('accounts-receivable-view-preference');

    // if (viewPreference === 'kanban') {
    //   this.router.navigate(['/dashboard/accounts-receivable/kanban']);
    // } else {
    //   // Padrão é lista
    this.router.navigate(['/dashboard/accounts-receivable/list']);
    // }
  }
}
