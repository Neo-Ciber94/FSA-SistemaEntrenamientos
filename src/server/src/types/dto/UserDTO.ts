import { RoleName } from '../RoleName';

export interface UserDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  role: RoleName;
}
