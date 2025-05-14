import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fuse-product-module',
  template: '<router-outlet></router-outlet>',
  standalone: false,
})
export class ProductComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
