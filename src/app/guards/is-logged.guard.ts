import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RedirectService } from '../services/redirect.service';

@Injectable({
  providedIn: 'root',
})
export class IsLoggedGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private redirectService: RedirectService
  ) {}

  canActivate(): boolean {
    if (this.authService.isLogin()) {
      return true;
    }

    this.redirectService.navigateTo404();
    return false;
  }
}
