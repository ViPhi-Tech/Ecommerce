import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'fuse-order-header',
  templateUrl: './order-header.component.html',
  styleUrls: ['./order-header.component.scss'],
  imports: [ButtonModule],
})
export class OrderHeaderComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
