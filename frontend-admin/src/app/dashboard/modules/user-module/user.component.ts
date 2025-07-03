import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fuse-user-module',
  template: `
    <div style="display: contents">
      <router-outlet #outlet="outlet"></router-outlet>
    </div>
  `,
  standalone: false,
})
export class UserComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
