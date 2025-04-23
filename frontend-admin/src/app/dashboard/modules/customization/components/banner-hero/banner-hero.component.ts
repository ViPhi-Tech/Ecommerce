import { Component, input, OnInit } from '@angular/core';
import { ButtonSeverityType } from '../../../../../shared/types/button.types';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'fuse-banner-hero',
  templateUrl: './banner-hero.component.html',
  styleUrls: ['./banner-hero.component.css'],
  imports: [
    ButtonModule
  ]
})
export class BannerHeroComponent implements OnInit {

  id = input('')

  title = input('')
  subtitle = input('')
  textColor = input('')

  backgroundImage = input('')

  buttonText = input('')
  buttonColor = input<ButtonSeverityType>('primary')

  constructor() { }

  ngOnInit() {
  }

}
