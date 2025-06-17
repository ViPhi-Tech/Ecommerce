import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fuse-product-module',
  template: `
    <div style="display: contents">
      <router-outlet #outlet="outlet"></router-outlet>
    </div>
  `,
  standalone: false,
})
export class ProductComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
