import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { routeAnimations } from 'app/shared/utils/animations';
@Component({
  selector: 'fuse-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [routeAnimations],
  standalone: false,
})
export class DashboardComponent implements OnInit {
  title = '';

  constructor() {}

  ngOnInit() {}

  prepareRoute(outlet: RouterOutlet | null) {
    if (!outlet || !outlet.isActivated) {
      return 'none';
    }
    return outlet.activatedRoute.snapshot.data['animation'] || 'none';
  }
}
