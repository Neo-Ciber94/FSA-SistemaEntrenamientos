import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Role } from '../models/Role';
import { NewUser, User } from '../models/User';
import { UserLogin } from '../models/UserLogin';

const USERS: User[] = [
  {
    id: 1,
    firstName: 'Admin',
    lastName: 'Admin',
    creationDate: new Date(),
    email: 'admin@admin.com',
    hash: '123',
    salt: '1',
    role: Role.Admin,
  },
  {
    id: 2,
    firstName: 'Teacher',
    lastName: 'Teacher',
    creationDate: new Date(),
    email: 'teacher@teacher.com',
    hash: '123',
    salt: '1',
    role: Role.Teacher,
  },
  {
    id: 3,
    firstName: 'Student',
    lastName: 'Student',
    creationDate: new Date(),
    email: 'student@student.com',
    hash: '123',
    salt: '1',
    role: Role.Student,
  },
];

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly userSubject = new BehaviorSubject<User | null>(null);
  readonly currentUser = this.userSubject.asObservable();

  login(credentials: UserLogin): Observable<User | null> {
    const match = USERS.find(
      (e) => e.email === credentials.username && e.hash === credentials.password
    );
    if (match) {
      this.userSubject.next(match);
      return of(match);
    } else {
      return of(null);
    }
  }

  logout() {
    this.userSubject.next(null);
  }

  register(user: NewUser): Observable<User> {
    throw new Error('Not implemented');
  }

  isLogin(): boolean {
    return this.userSubject.value == null;
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser;
  }

  get userRole() {
    const name = this.userSubject.value?.firstName.toLowerCase();
    if (name == null) {
      return null;
    }

    switch (name) {
      case 'admin':
        return Role.Admin;
      case 'teacher':
        return Role.Teacher;
      default:
        return Role.Student;
    }
  }
}
