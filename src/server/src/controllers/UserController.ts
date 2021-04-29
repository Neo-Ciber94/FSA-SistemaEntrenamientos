import { Get, JsonController, Param, QueryParam } from 'routing-controllers';
import { User } from '../entities/User';
import { RoleName, UserDTO } from '../types';
import { sanitizeUser } from '../utils';

@JsonController('/users')
export class UserController {
  @Get()
  async getAllUsers() {
    const users = await User.find({ relations: ['role'] });
    return sanitizeUser(users);
  }

  @Get('/:id([0-9]+)')
  async getUser(@Param('id') id: number) {
    const user = await User.findOne(id, { relations: ['role'] });
    return user && sanitizeUser(user);
  }

  @Get('/search')
  async searchUser(@QueryParam('email') email: string) {
    const user = await User.findByEmail(email, { relations: ['role'] });
    return user && sanitizeUser(user);
  }
}
