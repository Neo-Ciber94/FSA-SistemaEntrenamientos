import { RoleName } from '..';

export interface UserDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  role: RoleName;
  isDeleted: boolean;
}
