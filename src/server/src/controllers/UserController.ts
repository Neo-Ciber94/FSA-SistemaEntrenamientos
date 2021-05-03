import {
  Get,
  JsonController,
  OnUndefined,
  Param,
  QueryParam,
} from 'routing-controllers';
import { User } from '../entities/User';
import { sanitizeUser } from '../utils';

@JsonController('/users')
export class UserController {
  @Get()
  async getAllUsers() {
    const users = await User.find({
      relations: ['role'],
      where: {
        isDeleted: false,
      },
    });

    return sanitizeUser(users);
  }

  @Get('/:id([0-9]+)')
  @OnUndefined(200) // We send 'undefined' instead of 404
  async getUser(@Param('id') id: number) {
    const user = await User.findOne(id, {
      relations: ['role'],
      where: {
        isDeleted: false,
      },
    });
    return user && sanitizeUser(user);
  }

  @Get('/search')
  @OnUndefined(200) // We send 'undefined' instead of 404
  async searchUser(@QueryParam('email') email: string) {
    const user = await User.findByEmail(email, {
      relations: ['role'],
      where: {
        isDeleted: false,
      },
    });

    return user && sanitizeUser(user);
  }
}
