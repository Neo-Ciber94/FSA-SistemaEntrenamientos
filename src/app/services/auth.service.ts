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
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { ResponseBody, StatusCode } from 'src/shared';

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

  readonly currentUserObservable: Observable<
    User | undefined
  > = this.currentUserBehaviourSubject.asObservable();

  readonly tokenObservable: Observable<
    string | undefined
  > = this.tokenBehaviourSubject.asObservable();

  private tokenExpiration?: Date;
  private refreshTokenTimeoutId?: any;

  constructor(
    private apiService: ApiService,
    private userSevice: UserService
  ) {}

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
            this.setAuth(response.data!);
            this.startRefreshTokenRoutine();
            return response;
          } else {
            throw response;
          }
        }),
        // Set current user
        mergeMap(() => {
          this.userSevice.getAllUsers().subscribe((data) => console.log(data));
          return this.userSevice.getUserByEmail(userLogin.email);
        }),
        tap((user) => this.currentUserBehaviourSubject.next(user!))
      );
  }

  logout() {
    if (this.refreshTokenTimeoutId) {
      clearTimeout(this.refreshTokenTimeoutId);
    }

    return this.apiService.post<void, void>('auth/logout');
  }

  generateToken() {
    if (this.refreshTokenTimeoutId) {
      clearTimeout(this.refreshTokenTimeoutId);
    }
    return this.apiService.get<Session>('auth/token').pipe(
      tap((session) => {
        this.setAuth(session);
        this.startRefreshTokenRoutine();
      })
    );
  }

  getCurrentUserToken() {
    return this.tokenBehaviourSubject.value;
  }

  getTokenExpiration() {
    return this.tokenExpiration;
  }

  getCurrentUser() {
    return this.currentUserBehaviourSubject.value;
  }

  private startRefreshTokenRoutine() {
    this.refreshTokenTimeoutId = setTimeout(() => {
      this.generateToken().subscribe((newSession) => {
        this.setAuth(newSession);
      });
    }, new Date(this.tokenExpiration!).getTime());
  }

  private setAuth(session: Session) {
    this.tokenExpiration = session.tokenExpiration;
    this.tokenBehaviourSubject.next(session.token);
  }
}
