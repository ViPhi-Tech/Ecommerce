import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  model,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CartState } from '../order-cart/order-cart.state';
import { ClientState } from '../../../client-module/client.state';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClientService } from 'app/dashboard/modules/client-module/client.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IClient } from 'app/shared/interfaces/client/Client';

@Component({
  selector: 'fuse-client-selection',
  templateUrl: './client-selection.component.html',
  styleUrls: ['./client-selection.component.scss'],
  imports: [NgIcon, DialogModule, ButtonModule, InputTextModule, CommonModule],
})
export class ClientSelectionComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  public cartState = inject(CartState);
  public clientState = inject(ClientState);
  public clientService = inject(ClientService);

  show = model(false);

  @Output() closeClientSelection = new EventEmitter<any>();
  @Output() clientSelected = new EventEmitter<any>();

  searchTerm = signal('');

  constructor() {}

  ngOnInit() {
    this.clientService.onClientCreate$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.show.set(true);
        this.clientState.getClientList();
        this.searchTerm.set('');
      });
    this.clientState.getClientList();
  }

  onClientChange(client: IClient) {
    this.cartState.setClient(client);
    this.clientSelected.emit(client);
    this.close();
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.clientState.setSearchTerm(target.value);
  }

  // Getter para filtrar clientes com base no termo de busca
  get filteredClients() {
    const clients = this.clientState.clientList();
    const search = this.searchTerm().toLowerCase();

    if (!search) {
      return clients;
    }

    return clients.filter(
      (client: IClient) =>
        client.fullName.toLowerCase().includes(search) ||
        client.email.toLowerCase().includes(search) ||
        client.document?.toLowerCase().includes(search) ||
        client.phone?.toLowerCase().includes(search)
    );
  }

  createClient() {
    this.router.navigate([{ outlets: { drawer: ['clients', 'new'] } }]);
  }

  close() {
    this.show.set(false);
    this.closeClientSelection.emit();
  }
}
