import { RoleName } from './RoleName';

export interface NewUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UpdateUser {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
