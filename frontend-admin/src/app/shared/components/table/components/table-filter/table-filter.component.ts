import { Component, OnInit } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { PopoverModule } from 'primeng/popover';

@Component({
  selector: 'fuse-table-filter',
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.scss'],
  imports: [NgIcon, PopoverModule],
})
export class TableFilterComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
