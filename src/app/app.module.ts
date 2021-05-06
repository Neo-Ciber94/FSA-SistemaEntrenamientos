import {
  APP_INITIALIZER,
  ErrorHandler,
  NgModule,
  SecurityContext,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './views/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MarkdownModule } from 'ngx-markdown';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTokenInterceptor } from './interceptors/http-token.interceptor';
import { environment } from 'src/environments/environment';
import { AuthService } from './services/auth.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GlobalErrorHandler } from './handlers/GlobalErrorHandler';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    // FIXME: Is secure sanitize
    MarkdownModule.forRoot({ sanitize: SecurityContext.NONE }),
    SweetAlert2Module.forRoot(),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    { provide: 'API_URL', useValue: environment.apiUrl },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [AuthService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

function initApp(authService: AuthService) {
  return () => {
    authService.loadCurrentUser();
  };
}
