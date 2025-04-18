import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fuse-product-module',
  template: '<router-outlet></router-outlet>',
  standalone: false,
})
export class ProductModuleComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
