import { User } from '../entities/User';
import { UserDTO, RoleName } from '../types';

/**
 * Returns the user without password information.
 */
export function sanitizeUser(user: User): UserDTO;
export function sanitizeUser(user: User[]): UserDTO[];
export function sanitizeUser(user: User | User[]): UserDTO | UserDTO[] {
  if (Array.isArray(user)) {
    const result: UserDTO[] = [];
    for (const e of user) {
      result.push(sanitizeUser(e));
    }
    return result;
  } else {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
      role: user.role.name as RoleName,
    };
  }
}
