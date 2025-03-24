import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite } from '@capacitor-community/sqlite';

// Configuración para SQLite en web
const initializeApp = async () => {
  if (Capacitor.getPlatform() === 'web') {
    // Cargar SQL.js
    const sqliteScript = document.createElement('script');
    sqliteScript.src = 'https://cdn.jsdelivr.net/npm/sql.js@1.6.2/dist/sql-wasm.js';
    document.head.appendChild(sqliteScript);

    // Esperar a que se cargue el script
    await new Promise((resolve) => {
      sqliteScript.onload = resolve;
    });
  }
};

// Inicializar la app
initializeApp().then(() => {
  bootstrapApplication(AppComponent, {
    providers: [
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      provideRouter(routes),
      provideIonicAngular(),
      {
        provide: 'SQLITE',
        useFactory: () => {
          if (Capacitor.getPlatform() === 'web') {
            return (window as any).SQLite;
          }
          return CapacitorSQLite;
        }
      }
    ],
  }).catch(err => console.log(err));
});