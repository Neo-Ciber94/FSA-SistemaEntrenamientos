import { Get, JsonController, Param } from 'routing-controllers';
import { User } from '../entities/User';
import { RoleName, UserDTO } from '../types';

@JsonController('/users')
export class UserController {
  @Get()
  async getAllUsers() {
    const users = await User.find({ relations: ['role'] });
    return sanitizeUser(users);
  }

  @Get('/:id')
  async getUser(@Param('id') id: number) {
    const user = await User.findOne(id, { relations: ['role'] });
    return user && sanitizeUser(user);
  }
}

/**
 * Returns the user without password information.
 */
function sanitizeUser(user: User): UserDTO;
function sanitizeUser(user: User[]): UserDTO[];
function sanitizeUser(user: User | User[]): UserDTO | UserDTO[] {
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
      creationDate: user.creationDate,
      role: user.role.name as RoleName,
    };
  }
}
