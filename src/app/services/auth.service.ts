import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { RoleName } from '../models/RoleName';
import { User } from '../models/User';
import { UserSignup } from '../models/UserSignup';
import { UserLogin } from '../models/UserLogin';
import { UserUpdate } from '../models/UserUpdate';
import { Session } from '../models/Session';
import { ApiService } from './api.service';
import { UserService } from './user.service';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { ResponseBody } from 'src/shared';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserBehaviourSubject = new BehaviorSubject<User | undefined>(
    undefined
  );

  private tokenBehaviourSubject = new BehaviorSubject<string | undefined>(
    undefined
  );

  private refreshTokenTimeoutId?: number;

  constructor(
    private apiService: ApiService,
    private userSevice: UserService
  ) {}

  signup(userSignup: UserSignup) {
    // Would fail if the email exists
    return this.apiService.post<UserSignup, User>('auth/signup', userSignup);
  }

  update(userUpdate: UserUpdate) {
    return this.apiService.put<UserUpdate, User>('auth/update', userUpdate);
  }

  login(userLogin: UserLogin) {
    this.apiService
      .post<UserLogin, ResponseBody<User>>('auth/login', userLogin)
      .pipe(
        tap({
          next: (session) => {},
          error: (error) => {},
        })
      );
  }

  logout() {
    clearTimeout(this.refreshTokenTimeoutId);
    return this.apiService.post<void, void>('auth/logout');
  }

  private handleLoginError(error: any, next: Observable<Session>) {
    console.error(error);
    return next;
  }

  private setAuth(session: Session) {
    this.tokenBehaviourSubject.next(session.token);

    this.refreshTokenTimeoutId = setTimeout(() => {
      this.apiService.get<Session>('auth/token').subscribe((newSession) => {
        this.setAuth(newSession);
      });
    });
  }

  getToken() {
    return this.tokenBehaviourSubject.value;
  }

  getCurrentUser() {
    return this.currentUserBehaviourSubject.value;
  }
}
