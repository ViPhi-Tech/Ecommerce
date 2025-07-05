import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fuse-stock-movement-module',
  template: `
    <div style="display: contents">
      <router-outlet #outlet="outlet"></router-outlet>
    </div>
  `,
  standalone: false,
})
export class StockMovementComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
