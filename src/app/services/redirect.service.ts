import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RedirectService {
  constructor(private router: Router, private location: Location) {}

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
