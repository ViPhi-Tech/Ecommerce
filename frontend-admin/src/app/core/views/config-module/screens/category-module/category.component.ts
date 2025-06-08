import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'fuse-category-module',
  template: `
    <div [@routeAnimations]="prepareRoute(outlet)" style="display: contents">
      <router-outlet #outlet="outlet"></router-outlet>
    </div>
  `,
  standalone: false,
})
export class CategoryComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  prepareRoute(outlet: RouterOutlet | null) {
    if (!outlet || !outlet.isActivated) {
      return 'none';
    }
    return outlet.activatedRoute.snapshot.data['animation'] || 'none';
  }
}
