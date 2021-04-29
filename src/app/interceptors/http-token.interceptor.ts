import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { mergeMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // We ignore auth requests to avoid overflow
    if (this.isAuthRequest(request)) {
      return next.handle(request);
    }

    const token = this.authService.getCurrentUserToken();
    const tokenExpiration = this.authService.getTokenExpiration();
    const isExpired = tokenExpiration && tokenExpiration >= new Date();

    if (token == null || isExpired) {
      return this.authService.generateToken().pipe(
        mergeMap((session) => {
          const newRequest = this.setAutorizationToken(request, session.token);
          return next.handle(newRequest);
        })
      );
    } else {
      const newRequest = this.setAutorizationToken(request, token);
      console.log(newRequest.url, newRequest.headers);
      return next.handle(newRequest);
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
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      observe: 'response'
    };

    return request.clone({
      setHeaders: headers,
      withCredentials: true,
    });
  }
}
