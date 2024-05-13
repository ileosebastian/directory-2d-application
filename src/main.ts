import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

import { APP_CONFIG } from './app/app.config';

import { Capacitor } from '@capacitor/core';
import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader';


// To initialize if is a web platform to store data
const platform = Capacitor.getPlatform();

if (platform === 'web') {
  jeepSqlite(window);

  window.addEventListener(
    'DOMContentLoaded',
    () => {
      const jeepElement = document.createElement('jeep-sqlite');

      // jeepElement.autoSave = true;
      // jeepElement.wasmPath = '/assets';

      document.body.appendChild(jeepElement);
    }
  );
}


if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, APP_CONFIG);
