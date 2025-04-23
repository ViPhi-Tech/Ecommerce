import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'fuse-customization',
  template: '<router-outlet></router-outlet>',
  styles: `
    :host {
      height: calc(100vh - 64px);
    }
  `,
  imports: [RouterModule]
})
export class CustomizationComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
