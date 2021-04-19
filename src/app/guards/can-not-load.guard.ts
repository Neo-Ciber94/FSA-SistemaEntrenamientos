import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CanNotLoadGuard implements CanActivate, CanLoad {
  constructor(private router: Router, private location: Location) {}

  canActivate(): false {
    this.redirect();
    return false;
  }

  canLoad(): false {
    this.redirect();
    return false;
  }

  async redirect() {
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
