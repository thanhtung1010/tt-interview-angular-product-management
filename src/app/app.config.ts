import { ApplicationConfig, importProvidersFrom, ImportProvidersSource, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MenuSerice } from '@services';
import { MatDialogModule } from '@angular/material/dialog';

const _providers: Array<ImportProvidersSource> = [
  BrowserModule,
  BrowserAnimationsModule,
  MenuSerice,
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(_providers),
  ],
};
