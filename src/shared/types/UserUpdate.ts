import { RoleName } from './RoleName';

export interface UserUpdate {
  id: number;
  firstName: string;
  lastName: string;
  role: RoleName;
}
