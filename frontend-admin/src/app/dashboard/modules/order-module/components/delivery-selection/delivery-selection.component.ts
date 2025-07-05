import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CartState } from '../order-cart/order-cart.state';

interface DeliveryType {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconColor: string;
  price: number;
  priceLabel: string;
  priceColor: string;
}

@Component({
  selector: 'fuse-delivery-selection',
  templateUrl: './delivery-selection.component.html',
  imports: [NgIcon, DialogModule, ButtonModule],
})
export class DeliverySelectionComponent implements OnInit {
  public cartState = inject(CartState);

  visible = signal(false);

  @Output() deliveryTypeSelected = new EventEmitter<DeliveryType>();

  // Dados dos tipos de entrega
  deliveryTypes = signal<DeliveryType[]>([
    {
      id: 'retirada',
      name: 'Retirada na Loja',
      description: 'Retire em nossa loja',
      icon: 'lucideStore',
      iconColor: '#2563eb', // Azul direto
      price: 0,
      priceLabel: 'Grátis',
      priceColor: '#16a34a', // Verde direto
    },
    {
      id: 'delivery',
      name: 'Delivery',
      description: 'Entrega em sua casa',
      icon: 'lucideTruck',
      iconColor: '#ea580c', // Laranja direto
      price: 8.0,
      priceLabel: 'R$ 8,00',
      priceColor: '#4b5563', // Cinza direto
    },
    {
      id: 'expressa',
      name: 'Entrega Expressa',
      description: 'Entrega em até 30 minutos',
      icon: 'lucideMapPin',
      iconColor: '#dc2626', // Vermelho direto
      price: 15.0,
      priceLabel: 'R$ 15,00',
      priceColor: '#4b5563', // Cinza direto
    },
  ]);

  constructor() {}

  ngOnInit() {}

  // Métodos para lidar com seleções
  onDeliveryTypeChange(deliveryType: DeliveryType) {
    this.cartState.setDeliveryType(deliveryType);
    this.deliveryTypeSelected.emit(deliveryType);
  }
}
