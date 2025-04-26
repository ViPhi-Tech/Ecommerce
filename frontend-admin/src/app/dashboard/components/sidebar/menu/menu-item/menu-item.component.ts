import { Component, input, model, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBuilding2,
  lucideChartNoAxesColumn,
  lucideCreditCard,
  lucideFolder,
  lucideHouse,
  lucideMessagesSquare,
  lucideReceipt,
  lucideShield,
  lucideTags,
  lucideUsersRound,
  lucideVideo,
  lucideWallet,
  lucideTicketPercent,
  lucideFileText,
  lucidePaintbrush,
} from '@ng-icons/lucide';
import { matArrowDropDownOutline } from '@ng-icons/material-icons/outline';
import { heightAnimation } from '../../../../../shared/utils/animations';

export interface MenuItem {
  label: string;
  icon: string;
  route: string;
  items?: MenuItem[];
  visible?: boolean;
}

@Component({
  selector: 'fuse-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
  imports: [RouterModule, NgIcon],
  animations: [heightAnimation],
  viewProviders: [
    provideIcons({
      lucideHouse,
      lucideChartNoAxesColumn,
      lucideBuilding2,
      lucideFolder,
      lucideWallet,
      lucideReceipt,
      lucideCreditCard,
      lucideUsersRound,
      lucideShield,
      lucideMessagesSquare,
      lucideVideo,
      lucideTags,
      matArrowDropDownOutline,
      lucideTicketPercent,
      lucideFileText,
      lucidePaintbrush,
    }),
  ],
})
export class MenuItemComponent implements OnInit {
  item = model<MenuItem>({
    label: '',
    icon: '',
    route: '',
    items: [],
    visible: true,
  });

  addictionalClass = input<string>();

  constructor() {}

  ngOnInit() {}

  toggleMenu(state: boolean) {
    if (!this.item().items?.length) return;

    this.item.update(current => {
      current.visible = state;
      return current;
    });
  }

  onMouseEnter() {
    console.log('Mouse enter');
    this.toggleMenu(true);
  }
  onMouseLeave() {
    console.log('Mouse enter');
    this.toggleMenu(false);
  }
}
