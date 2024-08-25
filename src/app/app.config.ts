import { ApplicationConfig, importProvidersFrom, ImportProvidersSource, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FirebaseService, GoogleService, MenuService } from '@services';

const _providers: Array<ImportProvidersSource> = [
  BrowserModule,
  BrowserAnimationsModule,
  MenuService,
  FirebaseService,
  GoogleService,
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(_providers),
  ],
};
