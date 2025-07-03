import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { ClientState } from 'app/dashboard/modules/client-module/client.state';
import { OrderState } from 'app/dashboard/modules/order-module/order.state';
import { Client } from 'app/shared/interfaces/client-module.interface';

@Component({
  selector: 'fuse-order-client',
  templateUrl: './order-client.component.html',
  styleUrls: ['./order-client.component.scss'],
  imports: [NgIcon],
})
export class OrderClientComponent implements OnInit {
  private router = inject(Router);

  clientState = inject(ClientState);
  orderState = inject(OrderState);

  constructor() {}

  ngOnInit() {
    this.getClients();
  }

  getClients() {
    return this.clientState.getClientList()
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.clientState.setSearchTerm(target.value);
  }

  async createOrder(client: Client) {
    const order = await this.orderState.createPreOrder(client.id)
    if (order) {
      this.router.navigate(['dashboard', 'orders', order.id, 'products']);
    }
  }
}
