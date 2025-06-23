import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrderHeaderComponent } from '../../components/order-header/order-header.component';

@Component({
  selector: 'fuse-order-create',
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.scss'],
  imports: [OrderHeaderComponent, RouterModule],
})
export class OrderCreateComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
