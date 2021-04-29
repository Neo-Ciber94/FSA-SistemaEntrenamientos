import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CurrentUserResolver implements Resolve<User | undefined> {
  constructor(private authService: AuthService) {}

  resolve(): Observable<User | undefined> {
    return this.authService.currentUserObservable;
  }
}
