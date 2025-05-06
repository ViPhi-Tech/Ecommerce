import { Component, input, model, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
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
