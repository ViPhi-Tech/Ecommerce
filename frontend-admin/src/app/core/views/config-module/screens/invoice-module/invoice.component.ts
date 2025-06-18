import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'fuse-invoice-module',
  template: `
    <div style="display: contents">
      <router-outlet #outlet="outlet"></router-outlet>
    </div>
  `,
  standalone: false,
})
export class InvoiceComponent implements OnInit {
  protected route = inject(ActivatedRoute);
  constructor() {}

  ngOnInit() {}
}
