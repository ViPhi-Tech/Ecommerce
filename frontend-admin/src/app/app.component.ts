import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ScheduleNotificationComponent } from './shared/components/schedule-notification/schedule-notification.component';
import { UserMessageDialogComponent } from './shared/components/user-message-dialog/user-message-dialog.component';
import { ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'fuse-root',
  imports: [RouterModule, LoaderComponent, ToastModule, ConfirmDialogModule, ScheduleNotificationComponent, UserMessageDialogComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'sellup';

  constructor() {
    inject(ThemeService).init();
  }
}
