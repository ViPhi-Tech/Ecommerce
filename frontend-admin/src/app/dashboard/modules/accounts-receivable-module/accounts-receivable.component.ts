import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fuse-accounts-receivable',
  template: `
    <div style="display: contents">
      <router-outlet #outlet="outlet"></router-outlet>
    </div>
  `,
  standalone: false,
})
export class AccountsReceivableComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
