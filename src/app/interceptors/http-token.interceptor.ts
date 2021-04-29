import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, ObservableInput } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError, mergeMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // We ignore auth requests to avoid overflow
    if (this.isAuthRequest(request)) {
      return next.handle(request);
    }

    const token = this.authService.getSessionToken();
    const tokenExpiration = this.authService.getTokenExpiration();
    const isExpired = tokenExpiration && tokenExpiration >= new Date();

    if (token == null || isExpired) {
      return this.authService.generateToken().pipe(
        mergeMap((session) => {
          const newRequest = this.setAutorizationToken(request, session.token);
          return next.handle(newRequest).pipe(catchError(this.redirectOnError));
        })
      );
    } else {
      const newRequest = this.setAutorizationToken(request, token);
      return next.handle(newRequest).pipe(catchError(this.redirectOnError));
    }
  }

  isAuthRequest(request: HttpRequest<any>) {
    const url = request.url;
    const authUrl = `${environment.apiUrl}/auth`;
    return url.startsWith(authUrl);
  }

  setAutorizationToken(
    request: HttpRequest<any>,
    token: string
  ): HttpRequest<any> {
    // tslint:disable: object-literal-key-quotes
    // prettier-ignore
    const headers = {
      'Authorization': `Bearer ${token}`
    };

    return request.clone({
      setHeaders: headers,
      withCredentials: true,
    });
  }

  redirectOnError(
    error: any,
    caught: ObservableInput<any>
  ): ObservableInput<any> {
    console.error(error);
    this.router.navigateByUrl('/login');
    return caught;
  }
}
