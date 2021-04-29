import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { RedirectService } from '../services/redirect.service';

@Injectable({
  providedIn: 'root',
})
export class CanNotLoadGuard implements CanActivate, CanLoad {
  constructor(private redirectService: RedirectService) {}

  canActivate(): false {
    this.redirectService.navigateTo404();
    return false;
  }

  canLoad(): false {
    this.redirectService.navigateTo404();
    return false;
  }
}
