import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreService } from '../../services/core.service';

@Component({
  selector: 'fuse-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="coreService.loading$ | async"
      class="fixed inset-0 flex items-center justify-center bg-gray-500"
      style="  z-index: 5001;
        opacity: .3"
    >
      <div class="loader"></div>
    </div>
  `,
  styles: [
    `
      .loader {
        border: 4px solid transparent;
        border-top: 4px solid #fff;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class LoaderComponent {
  public coreService = inject(CoreService);
}
