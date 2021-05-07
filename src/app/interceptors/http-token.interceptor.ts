import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, ObservableInput } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { needsAuthentication } from 'src/shared';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {
    console.log(this);
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getSessionToken();
    const tokenExpiration = this.authService.getTokenExpiration();
    const isExpired = tokenExpiration ? new Date() >= tokenExpiration : true;

    // If the token is valid continue
    if (token && !isExpired) {
      const newRequest = this.setAuthorizationToken(request, token);
      return next.handle(newRequest).pipe(
        catchError((err, caught) => {
          return this.handleUnauthorizedError(request, next, err, caught);
        })
      );
    }

    // We ignore auth requests to avoid overflow
    if (needsAuthentication(environment.apiUrl, request.url) === false) {
      return next
        .handle(request)
        .pipe(
          catchError((err, caught) => this.logoutOnError(this, err, caught))
        );
    }

    // Generate a new token for the request
    return this.authService.generateToken().pipe(
      mergeMap((session) => {
        const newRequest = this.setAuthorizationToken(request, session.token);
        return next.handle(newRequest);
      })
    );
  }

  setAuthorizationToken(
    request: HttpRequest<any>,
    token: string
  ): HttpRequest<any> {
    const headers = {
      authorization: `Bearer ${token}`,
    };

    return request.clone({
      setHeaders: headers,
      withCredentials: true,
    });
  }

  logoutOnError(
    interceptor: HttpTokenInterceptor,
    error: any,
    caught: ObservableInput<any>
  ) {
    if (is401Unauthorized(error)) {
      interceptor.authService.clearCurrentUser();
      return interceptor.router.navigateByUrl('/login');
    }
    return caught;
  }

  handleUnauthorizedError(
    request: HttpRequest<any>,
    next: HttpHandler,
    error: any,
    caught: ObservableInput<any>
  ) {
    // Unauthorized
    if (is401Unauthorized(error)) {
      return this.authService.generateToken().pipe(
        map((session) => {
          const newRequest = this.setAuthorizationToken(request, session.token);
          const result = next.handle(newRequest);

          // Handle the request
          result.subscribe({
            next: () => {
              // Reload page
              window.location.reload();
            },
            error: (err) => {
              // If user still unauthorized, redirect to login
              if (is401Unauthorized(err)) {
                this.router.navigateByUrl('/login');
              }
            },
          });

          return result;
        })
      );
    }

    // Fallback
    return caught;
  }
}

function is401Unauthorized(error: any) {
  return error instanceof HttpErrorResponse && error.status === 401;
}
