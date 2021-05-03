import { Request, Response } from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

import { ACCESS_TOKEN_SECRET, BASE_URL } from '../config/config';
import jwt from 'jsonwebtoken';
import { Claims } from '../types/Claims';
import { User } from '../entities/User';

@Middleware({ type: 'before' })
export class AutenticateToken implements ExpressMiddlewareInterface {
  use(request: Request, response: Response, next: (err?: any) => any): void {
    // Check if the request url needs authentication
    if (!needsAuthentication(request)) {
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
        const user = await User.findOne(claims.id, { relations: ['sessions'] });

        // Check if the user have a session, otherwise `401 Unauthorized`
        if (await checkUserSession(request, user)) {
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

async function checkUserSession(request: Request, user?: User) {
  if (user && user.sessions.length > 0) {
    // Check if the cookie exists and match an user session
    const refreshToken = request.cookies['refreshToken'];
    if (user.sessions.find((e) => e.refreshToken === refreshToken)) {
      return true;
    }
  }

  // Fallback
  return false;
}

function needsAuthentication(request: Request) {
  const authUrl = `${BASE_URL}/auth`;
  const url = request.url;

  if (url.startsWith(authUrl)) {
    // Split the string removing any query params
    const urlRest = url.slice(authUrl.length).split('?')[0];

    switch (urlRest) {
      case '/signup':
      case '/login':
      case '/token':
      case '/user':
      case '/checkemail':
        return false;
    }
  }

  return true;
}
