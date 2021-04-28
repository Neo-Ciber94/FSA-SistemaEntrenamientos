import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { RoleName } from 'src/app/models/RoleName';
import { AuthService } from 'src/app/services/auth.service';

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
    if (this.authService.userRole === RoleName.Admin) {
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
