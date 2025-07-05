import { Component, input, OnInit } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

interface IMovementItem {
  type: 'in' | 'out';
  productName: string;
  productSku: string;
  quantity: number;
}

@Component({
  selector: 'fuse-movement-item',
  templateUrl: './movement-item.component.html',
  imports: [NgIcon],
})
export class MovementItemComponent implements OnInit {

  data = input<IMovementItem>();

  constructor() {}

  ngOnInit() {}
}
