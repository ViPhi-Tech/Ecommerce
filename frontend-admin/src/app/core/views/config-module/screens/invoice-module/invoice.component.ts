import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { routeAnimations } from 'app/shared/utils/animations';

@Component({
  selector: 'fuse-invoice-module',
  template: `
    <div [@routeAnimations]="prepareRoute(outlet)" style="display: contents">
      <router-outlet #outlet="outlet"></router-outlet>
    </div>
  `,
  animations: [routeAnimations],
  standalone: false,
})
export class InvoiceComponent implements OnInit {
  protected route = inject(ActivatedRoute);
  constructor() {}

  ngOnInit() {}

  prepareRoute(outlet: RouterOutlet | null) {
    if (!outlet || !outlet.isActivated) {
      return 'none';
    }
    return outlet.activatedRoute.snapshot.data['animation'] || 'none';
  }
}
