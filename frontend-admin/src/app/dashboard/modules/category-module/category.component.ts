import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fuse-category-module',
  template: `
    <div style="display: contents">
      <router-outlet #outlet="outlet"></router-outlet>
    </div>
  `,
  standalone: false,
})
export class CategoryComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
