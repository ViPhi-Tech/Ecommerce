import { Component, input, OnInit } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { IMovimentItem } from 'app/shared/interfaces/stock/IMovimentItem';

@Component({
  selector: 'fuse-movement-item',
  templateUrl: './movement-item.component.html',
  imports: [NgIcon, CommonModule],
})
export class MovementItemComponent implements OnInit {
  item = input<IMovimentItem>();
  loading = input<boolean>();

  constructor() {}

  ngOnInit() {}
}
