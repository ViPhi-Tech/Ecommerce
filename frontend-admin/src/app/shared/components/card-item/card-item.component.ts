import { Component, input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'fuse-card-item',
  templateUrl: './card-item.component.html',
  styleUrls: ['./card-item.component.scss'],
  imports: [NgIcon, RouterModule],
})
export class CardItemComponent implements OnInit {
  title = input<string | undefined>('');
  description = input<string | undefined>('');
  color = input<string | undefined>('');
  icon = input<string | undefined>('');
  href = input<string | undefined>('');

  constructor() {}

  ngOnInit() {}
}
