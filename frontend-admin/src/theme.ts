import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import {
  ApplicationConfig,
  importProvidersFrom,
  LOCALE_ID,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import * as lucideIcons from '@ng-icons/lucide';
import {
  matArrowDropDownOutline,
  matKeyboardArrowDownOutline,
} from '@ng-icons/material-icons/outline';
import { heroPencilSquare } from '@ng-icons/heroicons/outline';

import { providePrimeNG } from 'primeng/config';
import { routes } from './app/app.routes';
import { CoreInterceptor } from './app/shared/interceptors/core.interceptor';
import { Preset } from './prime.theme';
import { MessageService } from 'primeng/api';

registerLocaleData(localePt);

export const THEME: ApplicationConfig = {
  providers: [
    MessageService,
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([CoreInterceptor])),
    providePrimeNG({
      theme: {
        preset: Preset,
        options: {
          colorScheme: 'dark',
          theme: 'dark',
          darkModeSelector: '.dark',
        },
      },
    }),
    importProvidersFrom(NgIconsModule.withIcons(lucideIcons)),
    provideIcons({
      matArrowDropDownOutline,
      matKeyboardArrowDownOutline,
      heroPencilSquare,
    }),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ],
};
