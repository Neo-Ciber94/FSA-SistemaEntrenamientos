import { Body, JsonController, Post, Put, Res } from 'routing-controllers';
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User';
import bcrypt from 'bcrypt';
import { Role } from '../entities/Rol';
import { SECRET_KEY } from '../app';

@JsonController('/api/auth')
export class AuthController {
  @Post('/signup')
  async signupUser(@Body() user: NewUser) {
    const role = await Role.findOne({
      where: {
        name: 'student',
      },
    });

    const { salt, hash } = await encryptPassword(user.password);

    const newUser = User.create({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      salt,
      hash,
      role,
    });

    return User.save(newUser);
  }

  @Put('/update')
  async updateUser(@Body() newUser: NewUser, @Res() response: Response) {
    const user = await User.findOne(newUser.id);

    if (user) {
      const { salt, hash } = await encryptPassword(newUser.password);

      user.firstName = newUser.firstName;
      user.lastName = newUser.lastName;
      user.email = newUser.email;
      user.salt = salt;
      user.hash = hash;

      return User.save(user);
    } else {
      return response.status(404).send('invalid user');
    }
  }

  @Post('/login')
  async loginUser(
    @Body() credentials: { email: string; password: string },
    @Res() response: Response
  ) {
    const user = await User.findOne({
      where: { email: credentials.email },
      relations: ['role'],
    });

    if (user) {
      const isValid = await bcrypt.compare(credentials.password, user.hash);

      if (isValid) {
        const payload = {
          id: user.id,
          email: user.email,
          role: user.role.name,
        };

        const token = jwt.sign(payload, SECRET_KEY);
        return { token };
      }
    }

    return response.status(404).send('invalid email or password');
  }
}

interface NewUser {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

async function encryptPassword(
  password: string
): Promise<{ salt: string; hash: string }> {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  return { salt, hash };
}
