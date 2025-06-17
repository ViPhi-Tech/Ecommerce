import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'fuse-auth',
  template: `
    <div style="display: contents">
      <router-outlet #outlet="outlet"></router-outlet>
    </div>
  `,
  imports: [RouterModule],
})
export class AuthComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
