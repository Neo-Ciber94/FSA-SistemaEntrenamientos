import { Request, Response } from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

import { ACCESS_TOKEN_SECRET } from '../config/config';
import jwt from 'jsonwebtoken';
import { Claims } from '../types/Claims';
import { User } from '../entities/User';

@Middleware({ type: 'before' })
export class AutenticateToken implements ExpressMiddlewareInterface {
  use(request: Request, response: Response, next: (err?: any) => any): void {
    // Allow access to `/api/auth` without access token
    if (request.url.startsWith('/api/auth')) {
      next();
      return;
    }

    const authorization = request.headers['authorization'];
    const accessToken = authorization?.split(' ')[1];

    if (accessToken) {
      jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
          if (err.message === 'TokenExpiredError') {
            return response.status(401).send('token expired');
          }

          return response.sendStatus(403);
        }

        // Check if user still logged
        const claims = decoded as Claims;
        const user = await User.findOne(claims.id);

        // If still logged allow request, otherwise `401 Unauthorized`
        if (await checkIsAuthorized(request, user)) {
          next();
        } else {
          response.sendStatus(401);
        }
      });
    } else {
      response.sendStatus(401);
    }
  }
}

async function checkIsAuthorized(request: Request, user?: User) {
  if (user && user.refreshToken) {
    // Check if the cookie exists and match the user refreshToken
    const refreshToken = request.cookies['refreshToken'];
    if (user.refreshToken === refreshToken) {
      return true;
    } else {
      // Otherwise remove the token from the user
      user.refreshToken = null;
      await User.save(user);
    }
  }

  // Fallback
  return false;
}
