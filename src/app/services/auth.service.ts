import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NewUser, User } from '../models/User';
import { UserLogin } from '../models/UserLogin';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  login(credentials: UserLogin): Observable<User> {
    throw new Error('Not implemented');
  }

  logout() {
    throw new Error('Not implemented');
  }

  register(user: NewUser): Observable<User> {
    throw new Error('Not implemented');
  }

  isLogin(): boolean {
    throw new Error('Not implemented');
  }

  getCurrentUser(): Observable<User> {
    throw new Error('Not implemented');
  }

  isAdmin() {
    return true;
  }
}
