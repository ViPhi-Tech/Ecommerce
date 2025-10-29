import { Component, input, model, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { heightAnimation } from 'app/shared/utils/animations';

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  exact?: boolean;
  items?: MenuItem[];
  visible?: boolean;
  tree?: number; // Used to indicate the level of the menu item in a tree structure
}

@Component({
  selector: 'fuse-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
  imports: [RouterModule, NgIcon],
  animations: [heightAnimation],
})
export class MenuItemComponent implements OnInit {
  item = model<MenuItem>({
    id: '',
    label: '',
    icon: '',
    route: '',
    exact: false,
    items: [],
    visible: true,
  });

  addictionalClass = input<any>();

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
    this.toggleMenu(true);
  }
  onMouseLeave() {
    this.toggleMenu(false);
  }
}
