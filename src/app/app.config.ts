// By Angular
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, isDevMode } from "@angular/core"
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { getFirestore, provideFirestore } from "@angular/fire/firestore";
import { provideStorage, getStorage } from '@angular/fire/storage';

// By Ionic
import { provideIonicAngular, IonicRouteStrategy } from "@ionic/angular/standalone";
import { AppService } from "./app.service";

// Plugins!
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';

// Routes
import { routes } from "./app.routes";

import { environment } from "../environments/environment";


export function initializeFactory(init: AppService) {
  return async () => await init.initializeApp();
}


export const APP_CONFIG: ApplicationConfig = {
  providers: [
    { provide: APP_INITIALIZER, useFactory: initializeFactory, deps: [AppService], multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },

    provideIonicAngular(), // without this the new way to import ionic directives for standalone projects does not work

    // Utils
    importProvidersFrom(HttpClientModule),
    // Firestore for angular
    importProvidersFrom(provideFirebaseApp(() => initializeApp(environment.firebase))),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(provideStorage(() => getStorage())),

    // Plugis
    ScreenOrientation,

    // Routes
    provideRouter(routes),

    // For PWA
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
}