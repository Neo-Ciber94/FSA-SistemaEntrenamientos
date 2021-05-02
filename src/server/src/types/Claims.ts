import { RoleName } from '../../../shared/types/RoleName';

export interface Claims {
  id: number;
  email: string;
  role: RoleName;
}
