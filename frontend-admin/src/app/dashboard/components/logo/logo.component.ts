import { Component, OnInit, inject } from '@angular/core';
import { SidebarService } from '../../../shared/services/sidebar.service';

@Component({
  selector: 'fuse-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
})
export class LogoComponent implements OnInit {
  private sidebarService = inject(SidebarService);

  constructor() {}

  ngOnInit() {}

  toggleSidebar() {
    this.sidebarService.toggle();
  }
}
