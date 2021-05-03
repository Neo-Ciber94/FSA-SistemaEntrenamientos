import { Request } from 'express';
import { ACCESS_TOKEN_SECRET } from '../config/config';
import { User } from '../entities/User';
import { Claims, RoleName } from '../types';
import jwt from 'jsonwebtoken';

/**
 * Check if the user is authenticated
 * @param request The request.
 * @param allowedRoles The allowed roles.
 * @returns Returns `true` is the user is authorized otherwise `false`
 */
export async function authenticateUser(
  request: Request,
  allowedRoles: RoleName[]
): Promise<boolean> {
  const authorization = request.headers['authorization'];
  const accessToken = authorization?.split(' ')[1];

  if (accessToken) {
    return new Promise((resolve) => {
      jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
          resolve(false);
        }

        // Check if user still logged
        const claims = decoded as Claims;
        const user = await User.findOne(claims.id, {
          relations: ['sessions', 'role'],
        });

        if (user) {
          /* prettier-ignore */
          // Check if the user have a session, otherwise `401 Unauthorized`
          if (checkUserSession(request, user) && hasValidRole(user, allowedRoles)) {
            resolve(true);
          }
        }
      });
    });
  }

  // Fallback
  return false;
}

function hasValidRole(user: User, allowedRoles: RoleName[]) {
  if (allowedRoles.length === 0) {
    return true;
  }

  return allowedRoles.includes(user.role.name as RoleName);
}

function checkUserSession(request: Request, user?: User) {
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
