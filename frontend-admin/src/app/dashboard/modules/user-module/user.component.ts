import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fuse-user-module',
  template: '<router-outlet></router-outlet>',
  standalone: false,
})
export class UserComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
