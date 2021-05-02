import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RoleName } from 'src/shared';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.getCurrentUser()?.role === RoleName.Admin) {
      return true;
    }

    this.router
      .navigateByUrl('/404', { skipLocationChange: true })
      .then((navigated) => {
        if (navigated) {
          this.location.replaceState(state.url);
        }
      });
    return false;
  }
}
