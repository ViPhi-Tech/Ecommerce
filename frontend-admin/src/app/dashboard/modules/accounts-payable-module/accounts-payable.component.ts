import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fuse-accounts-payable',
  template: `
    <div style="display: contents">
      <router-outlet #outlet="outlet"></router-outlet>
    </div>
  `,
  standalone: false,
})
export class AccountsPayableComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
