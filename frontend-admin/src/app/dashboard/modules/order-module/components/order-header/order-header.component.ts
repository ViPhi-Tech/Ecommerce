import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from 'app/shared/services/core.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'fuse-order-header',
  templateUrl: './order-header.component.html',
  styleUrls: ['./order-header.component.scss'],
  imports: [ButtonModule],
})
export class OrderHeaderComponent implements OnInit {
  private router = inject(Router);
  private coreService = inject(CoreService); // Assuming CoreService is provided in the app

  today = signal(
    new Date().toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  );

  orderCode = signal('00000100');

  constructor() {}

  ngOnInit() {
    this.coreService.setPageTitle(
      `Pedido #${this.orderCode()}`,
      `Realizado em ${this.today()}`
    );
  }

  goBack() {
    this.router.navigate(['/dashboard/orders/list']);
  }
}
