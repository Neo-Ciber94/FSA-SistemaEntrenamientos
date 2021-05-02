import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { UserDTO } from 'src/shared';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private apiService: ApiService) {}

  getAllUsers() {
    return this.apiService.get<UserDTO[]>('users');
  }

  getUserById(id: number) {
    return this.apiService.get<UserDTO | undefined>(`users/${id}`);
  }

  getUserByEmail(email: string) {
    return this.apiService.get<UserDTO | undefined>(
      `users/search?email=${email}`
    );
  }
}
