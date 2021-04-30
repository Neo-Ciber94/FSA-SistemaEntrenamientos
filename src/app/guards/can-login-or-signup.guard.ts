import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RedirectService } from '../services/redirect.service';

@Injectable({
  providedIn: 'root',
})
export class CanLoginOrSignupGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private redirectService: RedirectService
  ) {}
  canActivate(): boolean {
    if (this.authService.isLogged()) {
      this.redirectService.navigateToDefaultUserPage();
      return false;
    }
    return true;
  }
}
