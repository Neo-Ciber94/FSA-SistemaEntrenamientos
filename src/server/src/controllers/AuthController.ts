import {
  Body,
  BodyParam,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  QueryParam,
  Req,
  Res,
} from 'routing-controllers';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User';

import {
  ACCESS_TOKEN_SECRET,
  DELETE_USER_AFTER_TIME,
  JWT_ACCESS_EXPIRATION_MS,
  JWT_REFRESH_EXPIRATION_MS,
} from '../config/config';
import { v4 as uuidv4 } from 'uuid';
import { Claims } from '../types/Claims';
import { RoleName } from '../../../shared/types/RoleName';
import bcrypt from 'bcrypt';
import { encryptPassword, sanitizeUser } from '../utils';
import { helper } from '../utils/ResponseHelper';
import { UserSession } from '../entities/UserSession';
import {
  Session,
  UserLogin,
  UserPasswordUpdate,
  UserSignup,
  UserUpdate,
  validatePassword,
} from '../types';
import { Role } from '../entities/Role';

@JsonController('/auth')
export class AuthController {
  @Post('/signup')
  async signup(@Body() user: UserSignup, @Res() response: Response) {
    const createdUser = await User.createWithRole({
      ...user,
      roleName: RoleName.Student,
    });

    // prettier-ignore
    const emailExists = (await User.count({ where: { email: user.email } })) > 0;

    if (emailExists) {
      return helper(response).emailExist();
    }

    const passwordValidation = validatePassword(user.password);
    if (passwordValidation.type === 'invalid') {
      return helper(response).invalidPassword(passwordValidation.error);
    }

    const newUser = sanitizeUser(await User.save(createdUser));
    return helper(response).success(newUser);
  }

  @Put('/update')
  async update(@Body() newUser: UserUpdate, @Res() response: Response) {
    const user = await User.findOne(newUser.id);

    if (user) {
      const role = await Role.findOne({ where: { name: newUser.role } });

      user.firstName = newUser.firstName;
      user.lastName = newUser.lastName;
      user.role = role!;

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
  async login(@Body() credentials: UserLogin, @Res() response: Response) {
    const user = await User.findByEmail(credentials.email, {
      relations: ['role'],
    });

    if (user && credentials.email && credentials.password) {
      const isValid = await bcrypt.compare(credentials.password, user.hash);

      if (isValid) {
        const claims: Claims = {
          id: user.id,
          email: user.email,
          role: user.role.name as RoleName,
        };

        // If deleted remove the mark
        if (user.isDeleted) {
          user.isDeleted = false;
          user.deleteAt = null;
          await User.save(user);
        }

        const session = newSession(claims);
        setRefreshTokenCookie(response, session.refreshToken);

        // Create a new user session for this user
        const userSession = UserSession.create({
          user,
          refreshToken: session.refreshToken,
        });

        userSession.user = user;
        await UserSession.save(userSession);
        return helper(response).success(session);
      }
    }

    return helper(response).invalidCredentials();
  }

  @Post('/logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    const refreshToken = getRefreshTokenCookie(request);

    if (refreshToken) {
      const userSession = await UserSession.findOne({
        where: { refreshToken },
      });
      if (userSession) {
        const deleteResult = await UserSession.delete(userSession.id);

        if (deleteResult.affected && deleteResult.affected > 0) {
          revokeRefreshTokenCookie(response);
          return response.sendStatus(200);
        }
      } else {
        return response.sendStatus(404);
      }
    }
    return response.sendStatus(401);
  }

  @Get('/token')
  async getToken(@Req() request: Request, @Res() response: Response) {
    const refreshToken = getRefreshTokenCookie(request);

    if (refreshToken) {
      const userSession = await UserSession.findOne({
        where: { refreshToken },
        relations: ['user', 'user.role'],
      });

      const user = userSession?.user;

      if (user && userSession) {
        const claims: Claims = {
          id: user.id,
          email: user.email,
          role: user.role.name as RoleName,
        };
        const session = newSession(claims);
        setRefreshTokenCookie(response, session.refreshToken);

        // Updates refresh token in the database
        userSession.refreshToken = session.refreshToken;
        await UserSession.save(userSession);
        return session;
      }
    }

    return response.sendStatus(401);
  }

  @Get('/user')
  async getLoggedUser(@Req() request: Request, @Res() response: Response) {
    const refreshToken = getRefreshTokenCookie(request);

    if (refreshToken) {
      const userSession = await UserSession.findOne({
        where: { refreshToken },
        relations: ['user', 'user.role'],
      });

      const user = userSession?.user;

      if (user) {
        const sanitizedUser = sanitizeUser(user);
        return helper(response).success(sanitizedUser);
      }
    }

    return helper(response).userNotFound();
  }

  @Post('/forcelogout')
  async forceLogout(@Req() request: Request, @Res() response: Response) {
    const refreshToken = getRefreshTokenCookie(request);

    if (refreshToken) {
      const userSession = await UserSession.findOne({
        where: { refreshToken },
        relations: ['user', 'user.sessions'],
      });

      const user = userSession?.user;
      if (user) {
        await UserSession.remove(user.sessions);
        return helper(response).success();
      }
    }

    return helper(response).userNotFound();
  }

  @Delete('/delete/:id')
  async deleteUser(@Param('id') id: number) {
    const user = await User.findOne(id, { relations: ['sessions'] });
    if (user && !user.isDeleted) {
      const sanitizedUser = sanitizeUser(user);

      // Mark user as deleted
      user.isDeleted = true;
      user.deleteAt = new Date(Date.now() + DELETE_USER_AFTER_TIME);
      await User.save(user);

      // Delete all the user sessions
      await UserSession.remove(user.sessions);

      return sanitizedUser;
    }
  }

  @Get('/checkemail')
  async emailExist(
    @QueryParam('email') email: string,
    @Res() response: Response
  ) {
    const user = await User.findByEmail(email);
    if (user) {
      return helper(response).success();
    } else {
      return helper(response).emailExist();
    }
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
