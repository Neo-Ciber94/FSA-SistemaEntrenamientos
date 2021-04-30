import { RoleName } from './RoleName';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: RoleName;
  createdAt: Date;
}
