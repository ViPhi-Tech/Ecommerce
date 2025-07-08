import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fuse-base-module',
  template: `
    <div style="display: contents">
      <router-outlet #outlet="outlet"></router-outlet>
    </div>
  `,
  standalone: false,
})
export class BaseComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
