import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { CLIPBOARD_OPTIONS,  provideMarkdown } from 'ngx-markdown';
import { CopyBtnComponent } from './ui/copy-btn/copy-btn.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideMarkdown({
      clipboardOptions: {
        provide: CLIPBOARD_OPTIONS,
        useValue: {
          buttonComponent: CopyBtnComponent,
        },
      },
    })
  ],
};
