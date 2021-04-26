import { Get, JsonController, Param } from 'routing-controllers';
import { User } from '../entities/User';
import { SanitizedUser } from '../types/Users';

@JsonController('/api/users')
export class UserController {
  @Get()
  async getAllUsers() {
    const users = await User.find();
    // return sanitizeUser(users);
    return users;
  }

  @Get('/:id')
  async getUser(@Param('id') id: number) {
    const user = await User.findOne(id);
    //return user && sanitizeUser(user);
    return user;
  }
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
