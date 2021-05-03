import { Action } from 'routing-controllers';
import { authenticateUser } from '../middlewares/authenticateUser';
import { RoleName } from '../types';

export function authorizationChecker(action: Action, roles: string[]) {
  return authenticateUser(action.request, roles as RoleName[]);
}
