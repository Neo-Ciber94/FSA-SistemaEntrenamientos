import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RoleName } from '../models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class RedirectService {
  constructor(
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) {}

  async navigateToDefaultUserPage() {
    const user = this.authService.getCurrentUser()!;
    switch (user.role) {
      case RoleName.Student:
      case RoleName.Teacher:
      case RoleName.Admin:
      default:
        this.router.navigateByUrl('/profile');
        break;
    }
  }

  async navigateTo404() {
    const currentUrl = this.location.path();
    return this.router
      .navigateByUrl('/404', {
        skipLocationChange: true,
      })
      .then((_) => {
        this.location.replaceState(currentUrl);
      });
  }
}
