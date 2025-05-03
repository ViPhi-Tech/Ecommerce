import { Component, input, OnInit } from '@angular/core';

@Component({
  selector: 'fuse-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
})
export class SectionComponent implements OnInit {
  title = input<string>('');

  constructor() {}

  ngOnInit() {}
}
