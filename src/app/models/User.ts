import { Role } from './Role';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  salt: string;
  hash: string;
  role: Role;
  creationDate: Date;
}

export interface NewUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
