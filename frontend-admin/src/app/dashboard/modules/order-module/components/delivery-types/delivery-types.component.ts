import { Component, OnInit, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

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
  selector: 'fuse-delivery-types',
  templateUrl: './delivery-types.component.html',
  imports: [NgIcon, DialogModule, ButtonModule],
})
export class DeliveryTypesComponent implements OnInit {
  visible = signal(false);

  // Dados dos tipos de entrega
  deliveryTypes = signal<DeliveryType[]>([
    {
      id: 'retirada',
      name: 'Retirada na Loja',
      description: 'Retire seu pedido em nossa loja',
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

  // Tipo de entrega selecionado - agora salva o objeto inteiro
  selectedDeliveryType = signal<DeliveryType | null>(null);

  constructor() {}

  ngOnInit() {}

  // Métodos para lidar com seleções
  onDeliveryTypeChange(deliveryType: DeliveryType) {
    this.selectedDeliveryType.set(deliveryType);
    this.visible.set(false);
    console.log('Tipo de entrega selecionado:', deliveryType);
  }
}
