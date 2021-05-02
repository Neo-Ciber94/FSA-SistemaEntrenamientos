import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { RoleName } from '../models/RoleName';
import { User } from '../models/User';
import { UserSignup } from '../models/UserSignup';
import { UserLogin } from '../models/UserLogin';
import { UserUpdate } from '../models/UserUpdate';
import { Session } from '../models/Session';
import { ApiService } from './api.service';
import { UserService } from './user.service';
import {
  catchError,
  distinctUntilChanged,
  map,
  mergeMap,
  shareReplay,
  take,
  tap,
} from 'rxjs/operators';
import { ResponseBody, StatusCode } from 'src/shared';
import { Router } from '@angular/router';

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

  private tokenExpiration?: Date;
  private refreshTokenTimeoutId?: NodeJS.Timeout;

  constructor(
    private apiService: ApiService,
    private userSevice: UserService
  ) {}

  loadCurrentUser() {
    this.apiService
      .get<ResponseBody<User>>('auth/user')
      .pipe(
        tap((response) => {
          if (response.success) {
            this.currentUserBehaviourSubject.next(response.data);
            this.generateToken();
          }
        })
      )
      .subscribe();
  }

  signup(userSignup: UserSignup) {
    return this.apiService
      .post<UserSignup, ResponseBody<User>>('auth/signup', userSignup)
      .pipe(
        map((response) => {
          if (response.success) {
            return response.data;
          } else {
            throw response;
          }
        })
      );
  }

  update(userUpdate: UserUpdate) {
    return this.apiService.put<UserUpdate, User>('auth/update', userUpdate);
  }

  login(userLogin: UserLogin) {
    return this.apiService
      .post<UserLogin, ResponseBody<Session>>('auth/login', userLogin)
      .pipe(
        map((response) => {
          if (response.success) {
            this.setSession(response.data!);
            this.startRefreshTokenRoutine();
            return response;
          } else {
            throw response;
          }
        }),
        // Set current user
        mergeMap(() => this.userSevice.getUserByEmail(userLogin.email)),
        tap((user) => this.currentUserBehaviourSubject.next(user!))
      );
  }

  logout() {
    if (this.refreshTokenTimeoutId) {
      clearTimeout(this.refreshTokenTimeoutId);
    }

    // Clearn data
    this.currentUserBehaviourSubject.next(undefined);
    this.tokenBehaviourSubject.next(undefined);

    return this.apiService.request((url, http) =>
      http
        .post(`${url}/auth/logout`, undefined, { responseType: 'text' })
        .pipe(map(() => {}))
    );
  }

  checkEmail(email: string) {
    return this.apiService
      .get<ResponseBody>(`auth/checkemail?email=${email}`)
      .pipe(map((result) => result.success));
  }

  generateToken() {
    if (this.refreshTokenTimeoutId) {
      clearTimeout(this.refreshTokenTimeoutId);
    }

    return this.apiService.get<Session>('auth/token').pipe(
      tap((session) => {
        this.setSession(session);
        this.startRefreshTokenRoutine();
      })
    );
  }

  getSessionToken() {
    return this.tokenBehaviourSubject.value;
  }

  getTokenExpiration() {
    return this.tokenExpiration;
  }

  getCurrentUser() {
    return this.currentUserBehaviourSubject.value;
  }

  isLogged() {
    return this.getCurrentUser() != null;
  }

  isAdmin() {
    return this.getCurrentUser()?.role === RoleName.Admin;
  }

  private startRefreshTokenRoutine() {
    this.refreshTokenTimeoutId = setTimeout(() => {
      this.generateToken().subscribe((newSession) => {
        this.setSession(newSession);
      });
    }, new Date(this.tokenExpiration!).getTime());
  }

  private setSession(session: Session) {
    this.tokenExpiration = session.tokenExpiration;
    this.tokenBehaviourSubject.next(session.token);
  }
}
