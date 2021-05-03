import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  ActivatedRoute,
} from '@angular/router';
import { UserDTO } from 'src/shared';
import { AuthService } from '../services/auth.service';
import { RedirectService } from '../services/redirect.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class UserResolver implements Resolve<UserDTO> {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private redirectService: RedirectService
  ) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<UserDTO> {
    const id = route.firstChild!.params.id;

    if (id) {
      const user = await this.userService.getUserById(id).toPromise();
      if (user) {
        return user;
      } else {
        return this.redirectService.navigateTo404() as never;
      }
    }

    return this.authService.getCurrentUser()!;
  }
}
