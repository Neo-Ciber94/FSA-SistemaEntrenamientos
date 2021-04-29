import {
  Body,
  BodyParam,
  Get,
  JsonController,
  Post,
  Put,
  Req,
  Res,
} from 'routing-controllers';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User';

import {
  ACCESS_TOKEN_SECRET,
  JWT_ACCESS_EXPIRATION_MS,
  JWT_REFRESH_EXPIRATION_MS,
} from '../config/config';
import { v4 as uuidv4 } from 'uuid';
import { Claims } from '../types/Claims';
import { NewUser, UserPasswordUpdate, UserUpdate } from '../types/Users';
import { Session } from '../types/Session';
import { RoleName } from '../types/RoleName';
import bcrypt from 'bcrypt';
import { encryptPassword, sanitizeUser } from '../utils';
import { helper } from '../utils/ResponseHelper';

@JsonController('/auth')
export class AuthController {
  @Post('/signup')
  async signup(@Body() user: NewUser, @Res() response: Response) {
    const createdUser = await User.createWithRole({
      ...user,
      roleName: RoleName.Student,
    });

    // prettier-ignore
    const emailExists = (await User.count({ where: { email: user.email } })) > 0;

    if (emailExists) {
      return helper(response).emailExist();
    }

    const newUser = sanitizeUser(await User.save(createdUser));
    return helper(response).success(newUser);
  }

  @Put('/update')
  async update(@Body() newUser: UserUpdate, @Res() response: Response) {
    const user = await User.findOne(newUser.id);

    if (user) {
      user.firstName = newUser.firstName;
      user.lastName = newUser.lastName;
      const sanitizedUser = sanitizeUser(await User.save(user));
      return sanitizedUser;
    } else {
      return response.status(404).send('invalid user');
    }
  }

  @Put('/changepassword')
  async changePassword(
    @Body() newUser: UserPasswordUpdate,
    @Res() response: Response
  ) {
    const user = await User.findOne(newUser.id);
    if (user) {
      const isSame = await bcrypt.compare(newUser.password, user.hash);

      if (isSame) {
        const { salt, hash } = await encryptPassword({
          password: newUser.newPassword,
        });

        user.hash = hash;
        user.salt = salt;
        await User.save(user);
        return helper(response).success();
      } else {
        return helper(response).invalidCredentials('Password missmatch');
      }
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

    // TODO: We don't check if the user is already logged and is logging from other device
    if (user && credentials.email && credentials.password) {
      const isValid = await bcrypt.compare(credentials.password, user.hash);

      if (isValid) {
        const claims: Claims = {
          id: user.id,
          email: user.email,
          role: user.role.name as RoleName,
        };

        const session = newSession(claims);
        setRefreshTokenCookie(response, session.refreshToken);

        // Save refresh token in database
        user.refreshToken = session.refreshToken;
        await User.save(user);
        return helper(response).success(session);
      }
    }

    return helper(response).invalidCredentials();
  }

  @Post('/logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    const refreshToken = getRefreshTokenCookie(request);

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
    const refreshToken = getRefreshTokenCookie(request);

    if (refreshToken) {
      const user = await User.findByRefreshToken(refreshToken, {
        relations: ['role'],
      });

      if (user) {
        const claims: Claims = {
          id: user.id,
          email: user.email,
          role: user.role.name as RoleName,
        };
        const session = newSession(claims);
        setRefreshTokenCookie(response, session.refreshToken);

        // Updates refresh token in the database
        user.refreshToken = session.refreshToken;
        await User.save(user);
        return session;
      }
    }

    return response.sendStatus(401);
  }

  @Get('/user')
  async getLoggedUser(@Req() request: Request, @Res() response: Response) {
    const refreshToken = getRefreshTokenCookie(request);

    if (refreshToken) {
      const user = await User.findByRefreshToken(refreshToken, {
        relations: ['role'],
      });
      if (user) {
        const sanitizedUser = sanitizeUser(user);
        return helper(response).success(sanitizedUser);
      }
    }

    return helper(response).userNotFound();
  }
}

// prettier-ignore
function newSession(claims: Claims): Session {
  const token = jwt.sign(claims, ACCESS_TOKEN_SECRET, {expiresIn: `${JWT_ACCESS_EXPIRATION_MS}ms`});
  const tokenExpiration = new Date(new Date().getTime() + JWT_ACCESS_EXPIRATION_MS);
  const refreshToken = uuidv4();
  return { token, tokenExpiration, refreshToken };
}

function getRefreshTokenCookie(request: Request): string | undefined {
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
    secure: false,
  });
}
