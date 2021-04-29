import { ResponseBody, StatusCode } from '../../../shared';
import { Response } from 'express';

export function helper(response: Response) {
  return new ResponseHelper(response);
}

export class ResponseHelper {
  constructor(private response: Response) {}

  send<T, ResBody extends ResponseBody<T>>(body: ResBody) {
    return this.response.status(200).json(body) as Response<ResBody>;
  }

  success<T>(data?: T, message?: string) {
    return this.send({
      success: true,
      statusCode: StatusCode.Success,
      statusMessage: message || 'Success',
      data,
    });
  }

  emailExist(message?: string) {
    return this.send({
      success: false,
      statusCode: StatusCode.EmailAlreadyExist,
      statusMessage: message || 'Email already exists',
    });
  }

  invalidCredentials(message?: string) {
    return this.send({
      success: false,
      statusCode: StatusCode.InvalidCredentials,
      statusMessage: message || 'invalid email or password',
    });
  }

  userNotFound(message?: string) {
    return this.send({
      success: false,
      statusCode: StatusCode.UserNotFound,
      statusMessage: message || 'the user was not found',
    });
  }

  invalidPassword(message?: string) {
    return this.send({
      success: false,
      statusCode: StatusCode.InvalidPassword,
      statusMessage: message || 'invalid password format',
    });
  }
}
