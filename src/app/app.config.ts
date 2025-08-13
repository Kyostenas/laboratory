import {
    ApplicationConfig,
    importProvidersFrom,
    LOCALE_ID,
    provideBrowserGlobalErrorListeners,
    provideZonelessChangeDetection,
} from '@angular/core';
import {
    PreloadAllModules,
    provideRouter,
    withHashLocation,
    withPreloading,
} from '@angular/router';
import { routes } from './app.routes';
import { APP_BASE_HREF } from '@angular/common';
import {
    provideHttpClient,
    withFetch,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
    providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: LOCALE_ID, useValue: 'es-MX' },
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideRouter(
            routes,
            withPreloading(PreloadAllModules),
            withHashLocation(),
        ),
        importProvidersFrom([BrowserModule]),
        provideHttpClient(withFetch(), withInterceptorsFromDi()),
    ],
};
