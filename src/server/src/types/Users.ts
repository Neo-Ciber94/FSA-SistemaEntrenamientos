import { Role } from '../entities/Rol';

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

export interface SanitizedUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  creationDate: Date;
  role: Role; // roleName: string?
}