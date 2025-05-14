import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fuse-config-module',
  template: '<router-outlet></router-outlet>',
  standalone: false,
})
export class ConfigComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
