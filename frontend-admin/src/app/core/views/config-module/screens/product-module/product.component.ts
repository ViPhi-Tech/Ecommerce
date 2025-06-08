import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { routeAnimations } from 'app/shared/utils/animations';

@Component({
  selector: 'fuse-product-module',
  template: `
    <div [@routeAnimations]="prepareRoute(outlet)" style="display: contents">
      <router-outlet #outlet="outlet"></router-outlet>
    </div>
  `,
  animations: [routeAnimations],
  standalone: false,
})
export class ProductComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  prepareRoute(outlet: RouterOutlet | null) {
    if (!outlet || !outlet.isActivated) {
      return 'none';
    }
    return outlet.activatedRoute.snapshot.data['animation'] || 'none';
  }
}
