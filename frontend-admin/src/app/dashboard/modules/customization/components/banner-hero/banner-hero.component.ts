import { Component, computed, input, OnInit } from '@angular/core';
import { ButtonSeverityType } from 'app/shared/types/button.types';
import { ButtonModule } from 'primeng/button';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'fuse-banner-hero',
  templateUrl: './banner-hero.component.html',
  styleUrls: ['./banner-hero.component.scss'],
  imports: [ButtonModule, NgIcon],
})
export class BannerHeroComponent implements OnInit {
  component = input({
    id: '',
    value: {
      title: 'Bem-vindo à nossa loja',
      subtitle: 'Encontre os melhores produtos com os melhores preços',
      textColor: '#FFFFFF',
      backgroundImage: '/assets/images/placeholder.svg',
      buttonText: 'Comprar agora',
      buttonColor: 'primary',
    },
  });

  id = computed(() => this.component().id || '');

  title = computed(() => this.component().value?.title || '');
  subtitle = computed(() => this.component().value?.subtitle || '');
  textColor = computed(() => this.component().value?.textColor || '');

  backgroundImage = computed(
    () => this.component().value?.backgroundImage || ''
  );

  buttonText = computed(() => this.component().value?.buttonText || '');
  buttonColor = computed<ButtonSeverityType>(
    () =>
      (this.component().value?.buttonColor as ButtonSeverityType) || 'primary'
  );

  constructor() {}

  ngOnInit() {}
}
