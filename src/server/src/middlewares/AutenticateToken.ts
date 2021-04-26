import { Request, Response } from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../app';

@Middleware({ type: 'before' })
export class AutenticateToken implements ExpressMiddlewareInterface {
  use(request: Request, response: Response, next: (err?: any) => any): void {
    if (request.url.startsWith('/api/auth')) {
      next();
      return;
    }

    const authorization = request.headers['authorization'];
    const token = authorization?.split(' ')[1];

    if (token) {
      jwt.verify(token, SECRET_KEY, (err) => {
        if (err) {
          console.error(err);
          return response.sendStatus(403);
        }

        next();
      });
    } else {
      response.sendStatus(401);
    }
  }
}
