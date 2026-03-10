import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { NgIcon } from '@ng-icons/core';
import { UserMessageDialogService } from 'app/shared/services/user-message-dialog.service';

@Component({
  selector: 'fuse-user-message-dialog',
  templateUrl: './user-message-dialog.component.html',
  styleUrls: ['./user-message-dialog.component.scss'],
  imports: [DialogModule, ButtonModule, NgIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMessageDialogComponent {
  dialog = inject(UserMessageDialogService);

  onHide(): void {
    this.dialog.close();
  }

  onPrimaryClick(): void {
    this.onHide();
  }

  onSecondaryClick(): void {
    this.onHide();
  }
}
