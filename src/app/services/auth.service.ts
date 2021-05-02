import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserLogin } from '../../shared/types/UserLogin';
import { ApiService } from './api.service';
import { UserService } from './user.service';
import { map, mergeMap, tap } from 'rxjs/operators';
import {
  ResponseBody,
  RoleName,
  Session,
  UserDTO,
  UserSignup,
  UserUpdate,
} from 'src/shared';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserBehaviourSubject = new BehaviorSubject<
    UserDTO | undefined
  >(undefined);

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
      .get<ResponseBody<UserDTO>>('auth/user')
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
      .post<UserSignup, ResponseBody<UserDTO>>('auth/signup', userSignup)
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
    return this.apiService.put<UserUpdate, UserDTO>('auth/update', userUpdate);
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

    return this.apiService.post('auth/logout', undefined, {
      responseType: 'text',
    });
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
