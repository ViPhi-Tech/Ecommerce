import { NgClass } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'fuse-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
  imports: [NgIcon, NgClass],
})
export class SectionComponent implements OnInit {
  title = input<string>('');
  icon = input<string>('');
  bordered = input<boolean>(true);
  padding = input<boolean>(true);

  constructor() {}

  ngOnInit() {}
}
