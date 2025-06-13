import { Component, input, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { ActionButtons } from 'app/shared/interfaces/table.interfaces';
import { SplitButtonModule } from 'primeng/splitbutton';
import { PopoverModule } from 'primeng/popover';

@Component({
  selector: 'fuse-table-actions',
  templateUrl: './table-actions.component.html',
  styleUrls: ['./table-actions.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TooltipModule,
    OverlayPanelModule,
    PopoverModule,
    SplitButtonModule,
    NgIcon,
  ],
})
export class TableActionsComponent implements OnInit {
  data = input();
  buttons = input<ActionButtons[]>([]);
  rowIndex = input('');
  type = input<string>('buttons');

  actions = signal<any>([]);
  moreActions = signal<any>([]);

  showMoreActions = false;

  constructor() {}

  ngOnInit() {
    if (this.type() === 'buttons') {
      this.createActionButtons();
    }
    if (this.type() === 'dropdown') {
      this.createActionDropdown();
    }
  }

  createActionButtons() {
    const buttonRef: any = [];

    if (this.buttons()?.length) {
      for (const btn of this.buttons()) {
        if (!btn.show || (btn.show && btn.show(this.data))) {
          buttonRef.push(btn);
        }
      }
    }

    this.actions.set(buttonRef);

    if (this.actions()?.length > 3 && this.isDesktop()) {
      this.moreActions.set(this.actions()?.splice(2, this.actions()?.length));
    }

    if (this.isMobile()) {
      if (this.actions()?.length == 1) {
        return;
      }
      this.moreActions.set(this.actions()?.splice(0, this.actions()?.length));
    }
  }

  createActionDropdown() {
    this.actions.set(this.buttons());
  }

  toogleMoreActions(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    this.showMoreActions = !this.showMoreActions;
  }

  clickAction(config: any) {
    config.action(this.data(), this.rowIndex());
  }

  isDesktop() {
    return window.innerWidth > 768;
  }

  isMobile() {
    return window.innerWidth <= 768;
  }
}
