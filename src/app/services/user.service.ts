import { Injectable } from '@angular/core';
import { User } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private apiService: ApiService) {}

  getAllUsers() {
    return this.apiService.get<User[]>('users');
  }

  getUserById(id: number) {
    return this.apiService.get<User | undefined>(`users/${id}`);
  }

  getUserByEmail(email: string) {
    return this.apiService.get<User | undefined>(`users/search?email=${email}`);
  }
}
