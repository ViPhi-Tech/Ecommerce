import { Component, computed, inject, model, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { NgIcon } from '@ng-icons/core';
import { ClientState } from 'app/dashboard/modules/client-module/client.state';

@Component({
  selector: 'fuse-client-select',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectModule, NgIcon],
  template: `
    <p-select
      class="w-full max-w-64"
      [options]="clientOptions()"
      [(ngModel)]="selectedClient"
      optionLabel="label"
      optionValue="value"
      [placeholder]="placeholder()"
      [loading]="clientState.loading()"
      (onChange)="onClientChange($event.value)"
      [showClear]="true"
      [filter]="true"
      filterBy="label"
      [filterPlaceholder]="'Pesquisar cliente...'"
    >
      <ng-template #selectedItem let-selectedOption>
        <div class="flex items-center gap-2">
          <ng-icon name="lucideUser" size="16" />
          <span>{{ selectedOption.label }}</span>
        </div>
      </ng-template>
    </p-select>
  `,
})
export class ClientSelectComponent implements OnInit {
  clientState = inject(ClientState);

  // Model para two-way binding
  selectedClient = model<string | null>(null);

  // Input para placeholder customizado
  placeholder = model<string>('Selecione um cliente');

  // Input para controlar se exibe "Todos os clientes"
  allowAll = model<boolean>(true);

  clientOptions = computed(() => {
    const clients = this.clientState.clientList();
    const options = clients.map(client => ({
      label: client.fullName || client.document || 'Cliente sem nome',
      value: client.id || client.document || '',
    }));

    if (this.allowAll()) {
      return [{ label: 'Todos os clientes', value: null }, ...options];
    }

    return options;
  });

  ngOnInit() {
    // Busca a lista de clientes ao inicializar o componente
    this.clientState.getClientList();
  }

  onClientChange(value: string | null) {
    this.selectedClient.set(value);
  }
}
