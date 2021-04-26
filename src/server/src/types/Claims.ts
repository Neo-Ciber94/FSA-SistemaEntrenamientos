import { RoleName } from './RoleName';

export interface Claims {
  id: number;
  email: string;
  role: RoleName;
}
