import { enableProdMode, Injector } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

let APP_INJECTOR: Injector;

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then((componentRef) => {
    APP_INJECTOR = componentRef.injector;
  })
  .catch((err) => console.error(err));

export function getAppInjector() {
  return APP_INJECTOR;
}
