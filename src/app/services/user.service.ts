import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserLogin } from '../models/UserLogin';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject = new BehaviorSubject<UserLogin | null>(null);

  constructor() {}

  login(user: UserLogin) {
    this.userSubject.next(user);
  }

  logout() {
    this.userSubject.next(null);
  }

  get currentUser(): UserLogin | null {
    return this.userSubject.value;
  }
}
