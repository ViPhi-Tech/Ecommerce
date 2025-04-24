import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CustomizationService {
  constructor() {}

  getComponents() {
    return [
      {
        name: 'Banner Hero',
        type: 'banner-hero',
        value: {
          title: 'Bem-vindo à nossa loja',
          subtitle: 'Encontre os melhores produtos com os melhores preços',
          textColor: '#FFFFFF',
          backgroundImage: '/assets/images/placeholder.svg',
          buttonText: 'Comprar agora',
          buttonColor: 'primary',
        },
        properties: [
          {
            name: 'title',
            type: 'text',
            label: 'Título',
          },
          {
            name: 'subtitle',
            type: 'textarea',
            label: 'Subtítulo',
          },
          {
            name: 'textColor',
            type: 'color',
            label: 'Cor do Texto',
          },
          {
            name: 'backgroundImage',
            type: 'text',
            label: 'Imagem de Fundo',
          },
          {
            name: 'buttonText',
            type: 'text',
            label: 'Texto do Botão',
          },
          {
            name: 'buttonColor',
            type: 'select',
            label: 'Cor do Botão',
            options: [
              { label: 'Primário', value: 'primary' },
              { label: 'Secundário', value: 'secondary' },
              // { label: 'Sucesso', value: 'success' },
              // { label: 'Vermelho', value: 'danger' },
              // { label: 'Amarelo', value: 'warning' },
              // { label: 'Informativo', value: 'info' },
              // { label: 'Alerta', value: 'warn' },
              // { label: 'Contraste', value: 'contrast' },
              // { label: 'Ajuda', value: 'help' },
            ],
          },
        ],
      },
      {
        name: 'Carrossel de Produtos',
        type: 'product-carousel',
      },
      {
        name: 'Categorias',
        type: 'categories',
      },
      {
        name: 'Banner Promocional',
        type: 'promo-banner',
      },
      {
        name: 'Newsletter',
        type: 'newsletter',
      },
      {
        name: 'Depoimentos',
        type: 'testimonials',
      },
    ];
  }
}
