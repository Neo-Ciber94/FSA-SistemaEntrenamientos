import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { RoleName } from 'src/shared';
import { AuthService } from '../services/auth.service';
import { RedirectService } from '../services/redirect.service';

@Injectable({
  providedIn: 'root',
})
export class IsTeacherGuard implements CanActivate {
  constructor(
    private redirectService: RedirectService,
    private authService: AuthService
  ) {}

  async canActivate(): Promise<boolean> {
    if (this.authService.getCurrentUser()?.role === RoleName.Teacher) {
      return true;
    }

    await this.redirectService.navigateTo404();
    return false;
  }
}
