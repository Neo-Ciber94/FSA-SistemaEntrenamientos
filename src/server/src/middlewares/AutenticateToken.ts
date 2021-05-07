import { needsAuthentication } from '../types';
import { Request, Response } from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

import { BASE_URL } from '../config/config';
import { authenticateUser } from './authenticateUser';

@Middleware({ type: 'before' })
export class AutenticateToken implements ExpressMiddlewareInterface {
  use(request: Request, response: Response, next: (err?: any) => any): void {
    // Check if the request url needs authentication
    if (!needsAuthentication(BASE_URL, request.url)) {
      next();
      return;
    }

    authenticateUser(request, []).then((authorized) => {
      if (authorized) {
        next();
      } else {
        response.sendStatus(401);
      }
    });
  }
}

// function needsAuthentication(request: Request) {
//   const authUrl = `${BASE_URL}/auth`;
//   const url = request.url;

//   if (url.startsWith(authUrl)) {
//     // Split the string removing any query params
//     const urlRest = url.slice(authUrl.length).split('?')[0];

//     switch (urlRest) {
//       case '/signup':
//       case '/login':
//       case '/token':
//       case '/user':
//       case '/checkemail':
//         return false;
//     }
//   }

//   return true;
// }
