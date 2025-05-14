import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'fuse-auth',
  template: '<router-outlet></router-outlet>',
  imports: [RouterModule],
})
export class AuthComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
