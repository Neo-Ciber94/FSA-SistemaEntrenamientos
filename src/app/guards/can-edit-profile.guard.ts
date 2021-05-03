import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { RedirectService } from '../services/redirect.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class CanEditProfileGuard implements CanActivate {
  constructor(
    private redirectService: RedirectService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    if (this.authService.isAdmin()) {
      return true;
    }

    const id = route.params.id;
    let canEdit = false;

    if (id) {
      const user = await this.userService.getUserById(id).toPromise();
      if (user) {
        canEdit = this.authService.isCurrentUser(user);
      }
    } else {
      canEdit = this.authService.getCurrentUser() != null;
    }

    if (!canEdit) {
      this.redirectService.navigateTo404();
      return false;
    }

    return canEdit;
  }
}
