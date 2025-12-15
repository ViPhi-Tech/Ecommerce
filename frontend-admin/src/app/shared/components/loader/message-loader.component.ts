import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'fuse-message-loader',
  standalone: true,
  imports: [CommonModule, NgIcon],
  template: `
    @if (visible() && modal()) {
      <div
        class="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[9999] animate-fade-in"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 flex flex-col items-center gap-6 max-w-md mx-4 animate-scale-in"
        >
          <!-- Ícone com animação -->
          <div class="relative">
            <div
              class="absolute inset-0 bg-gray/20 dark:bg-gray/30 rounded-full animate-ping"
            ></div>
            <div
              class="relative flex items-center justify-center w-16 h-16 bg-gray/10 dark:bg-gray/20 rounded-full"
            >
              <ng-icon
                [name]="icon()"
                class="w-8 h-8 text-primary dark:text-primary-400"
              />
            </div>
          </div>

          <!-- Mensagem -->
          <div class="text-center">
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
            >
              {{ message() }}
            </h3>
            @if (description()) {
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ description() }}
              </p>
            }
          </div>

          <!-- Spinner de loading -->
          <div class="flex gap-2">
            <div
              class="w-2 h-2 bg-primary rounded-full animate-bounce"
              style="animation-delay: 0ms"
            ></div>
            <div
              class="w-2 h-2 bg-primary rounded-full animate-bounce"
              style="animation-delay: 150ms"
            ></div>
            <div
              class="w-2 h-2 bg-primary rounded-full animate-bounce"
              style="animation-delay: 300ms"
            ></div>
          </div>
        </div>
      </div>
    }
    @if (visible() && !modal()) {
      <div class="flex flex-col items-center gap-6 p-8">
        <!-- Ícone com animação -->
        <div class="relative">
          <div
            class="absolute inset-0 bg-gray/20 dark:bg-gray/30 rounded-full animate-ping"
          ></div>
          <div
            class="relative flex items-center justify-center w-16 h-16 bg-gray/10 dark:bg-gray/20 rounded-full"
          >
            <ng-icon
              [name]="icon()"
              class="w-8 h-8 text-primary dark:text-primary-400"
            />
          </div>
        </div>

        <!-- Mensagem -->
        <div class="text-center">
          <h3
            class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
          >
            {{ message() }}
          </h3>
          @if (description()) {
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ description() }}
            </p>
          }
        </div>

        <!-- Spinner de loading -->
        <div class="flex gap-2">
          <div
            class="w-2 h-2 bg-primary rounded-full animate-bounce"
            style="animation-delay: 0ms"
          ></div>
          <div
            class="w-2 h-2 bg-primary rounded-full animate-bounce"
            style="animation-delay: 150ms"
          ></div>
          <div
            class="w-2 h-2 bg-primary rounded-full animate-bounce"
            style="animation-delay: 300ms"
          ></div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      @keyframes fade-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes scale-in {
        from {
          transform: scale(0.9);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }

      .animate-fade-in {
        animation: fade-in 0.2s ease-out;
      }

      .animate-scale-in {
        animation: scale-in 0.3s ease-out;
      }
    `,
  ],
})
export class MessageLoaderComponent {
  visible = input<boolean>(false);
  modal = input<boolean>(true);
  message = input<string>('Carregando...');
  description = input<string>('');
  icon = input<string>('lucideLoader2');
}
