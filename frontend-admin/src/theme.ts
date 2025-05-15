import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import {
  lucideArchive,
  lucideBadgePlus,
  lucideBell,
  lucideBox,
  lucideBuilding2,
  lucideChartBar,
  lucideChartNoAxesColumn,
  lucideChevronRight,
  lucideCircleHelp,
  lucideCloudUpload,
  lucideCreditCard,
  lucideFileText,
  lucideFolder,
  lucideHouse,
  lucideMessagesSquare,
  lucideMoon,
  lucideMove,
  lucidePackage,
  lucidePaintbrush,
  lucideReceipt,
  lucideSettings,
  lucideShield,
  lucideShoppingCart,
  lucideStore,
  lucideSun,
  lucideTags,
  lucideTicketPercent,
  lucideTruck,
  lucideUser,
  lucideUsers,
  lucideUsersRound,
  lucideVideo,
  lucideWallet,
  lucideX,
} from '@ng-icons/lucide';
import { matArrowDropDownOutline } from '@ng-icons/material-icons/outline';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app/app.routes';
import { CoreInterceptor } from './app/shared/interceptors/core.interceptor';
import { Preset } from './prime.theme';

registerLocaleData(localePt);

export const THEME: ApplicationConfig = {
  providers: [
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
    provideIcons({
      matArrowDropDownOutline,
      lucideBox,
      lucideBadgePlus,
      lucideSettings,
      lucideCircleHelp,
      lucideSun,
      lucideMoon,
      lucideBell,
      lucideChevronRight,
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
      lucideTicketPercent,
      lucideFileText,
      lucidePaintbrush,
      lucideArchive,
      lucideMove,
      lucideX,
      lucideUser,
      lucideUsers,
      lucideChartBar,
      lucideCloudUpload,
      lucidePackage,
      lucideTruck,
      lucideShoppingCart,
      lucideStore
    }),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ],
};
