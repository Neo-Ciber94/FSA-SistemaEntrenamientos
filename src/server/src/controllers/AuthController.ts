import {
  Body,
  JsonController,
  Param,
  Post,
  Put,
  Req,
  Res,
} from 'routing-controllers';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User';
import bcrypt from 'bcrypt';
import { Role } from '../entities/Rol';
import {
  ACCESS_TOKEN_SECRET,
  JWT_ACCESS_EXPIRATION_MS,
  JWT_REFRESH_EXPIRATION_MS,
  REFRESH_TOKEN_SECRET,
} from '../config/config';
import { v4 as uuidv4 } from 'uuid';
import { Claims } from '../types/Claims';
import { NewUser, UpdateUser } from '../types/Users';
import { Session } from '../types/Session';

@JsonController('/api/auth')
export class AuthController {
  @Post('/signup')
  async signup(@Body() user: NewUser) {
    const role = await Role.findOne({
      where: {
        name: 'student',
      },
    });

    const { salt, hash } = await encryptPassword({ password: user.password });

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
  async update(@Body() newUser: UpdateUser, @Res() response: Response) {
    const user = await User.findOne(newUser.id);

    if (user) {
      const { salt, hash } = await encryptPassword({
        salt: user.salt,
        password: newUser.password,
      });

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
  async login(
    @Body() credentials: { email: string; password: string },
    @Res() response: Response
  ) {
    const user = await User.findByEmail(credentials.email, {
      relations: ['role'],
    });

    if (user) {
      const isValid = await bcrypt.compare(credentials.password, user.hash);

      if (isValid) {
        const claims: Claims = {
          id: user.id,
          email: user.email,
          role: user.role.name,
        };

        const session = newJwtSession(claims);
        setRefreshTokenCookie(response, session.refreshToken);

        // Save refresh token in database
        user.refreshToken = session.refreshToken;
        await User.save(user);
        return session;
      }
    }

    return response.status(404).send('invalid email or password');
  }

  @Post('/logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    const refreshToken = getRefreshToken(request);

    if (refreshToken) {
      const user = await User.findByRefreshToken(refreshToken);

      if (user) {
        user.refreshToken = null;
        await User.save(user);

        revokeRefreshTokenCookie(response);
        return response.sendStatus(200);
      }
    }
    return response.sendStatus(401);
  }

  @Post('/token')
  async getToken(@Req() request: Request, @Res() response: Response) {
    const refreshToken = getRefreshToken(request);

    if (refreshToken) {
      const user = await User.findByRefreshToken(refreshToken, {
        relations: ['role'],
      });

      if (user) {
        const claims: Claims = {
          id: user.id,
          email: user.email,
          role: user.role.name,
        };
        const session = newJwtSession(claims);
        setRefreshTokenCookie(response, session.refreshToken);

        // Updates refresh token in the database
        user.refreshToken = session.refreshToken;
        await User.save(user);
        return session;
      }
    }

    return response.sendStatus(401);
  }
}

async function encryptPassword(data: {
  password: string;
  salt?: string;
}): Promise<{ salt: string; hash: string }> {
  const salt = data.salt || (await bcrypt.genSalt(10));
  const hash = await bcrypt.hash(data.password, salt);

  return { salt, hash };
}

// prettier-ignore
function newJwtSession(claims: Claims): Session {
  const jwtToken = jwt.sign(claims, ACCESS_TOKEN_SECRET, {expiresIn: `${JWT_ACCESS_EXPIRATION_MS}ms`});
  const jwtExpiration = new Date(new Date().getTime() + JWT_ACCESS_EXPIRATION_MS);
  const refreshToken = uuidv4();
  return { jwtToken, jwtExpiration, refreshToken };
}

function getRefreshToken(request: Request): string | undefined {
  const cookies = request.cookies;

  if (cookies) {
    return cookies['refreshToken'];
  }
}

function setRefreshTokenCookie(response: Response, refreshToken: string) {
  response.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: JWT_REFRESH_EXPIRATION_MS,
    secure: false,
  });
}

function revokeRefreshTokenCookie(response: Response) {
  response.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0),
  });
}
