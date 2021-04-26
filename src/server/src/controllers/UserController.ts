import { Get, JsonController, OnUndefined, Param } from 'routing-controllers';
import { Role } from '../entities/Rol';
import { User } from '../entities/User';

@JsonController('/api/users')
export class UserController {
  @Get()
  async getAllUsers() {
    const users = await User.find();
    return sanitizeUser(users);
  }

  @Get('/:id')
  async getUser(@Param('id') id: number) {
    const user = await User.findOne(id);
    return user && sanitizeUser(user);
  }
}

interface SanitizedUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  creationDate: Date;
  role: Role;
}

/**
 * Returns the user without password information.
 */
function sanitizeUser(user: User): SanitizedUser;
function sanitizeUser(user: User[]): SanitizedUser[];
function sanitizeUser(user: User | User[]): SanitizedUser | SanitizedUser[] {
  if (Array.isArray(user)) {
    const result: SanitizedUser[] = [];
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
      creationDate: user.creationDate,
      role: user.role,
    };
  }
}
