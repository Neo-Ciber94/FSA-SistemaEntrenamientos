import { RoleName } from './RoleName';

export interface NewUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserUpdate {
  id: number;
  firstName: string;
  lastName: string;
}

export interface UserPasswordUpdate {
  id: number;
  password: string;
  newPassword: string;
}
