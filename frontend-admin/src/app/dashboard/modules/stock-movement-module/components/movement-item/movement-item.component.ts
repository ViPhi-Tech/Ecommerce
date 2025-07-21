import { Component, input, OnInit } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { IMovimentItem } from 'app/shared/interfaces/stock-movement.interface';

@Component({
  selector: 'fuse-movement-item',
  templateUrl: './movement-item.component.html',
  imports: [NgIcon],
})
export class MovementItemComponent implements OnInit {
  item = input<IMovimentItem>();
  loading = input<boolean>();

  constructor() {}

  ngOnInit() {}
}
