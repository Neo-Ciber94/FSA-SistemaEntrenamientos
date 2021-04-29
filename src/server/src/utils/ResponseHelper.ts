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

  success<T>(data?: T) {
    return this.send({
      success: true,
      statusCode: StatusCode.Success,
      statusMessage: 'Success',
      data,
    });
  }

  emailExist() {
    return this.send({
      success: false,
      statusCode: StatusCode.EmailAlreadyExist,
      statusMessage: 'Email already exists',
    });
  }

  invalidCredentials() {
    return this.send({
      success: false,
      statusCode: StatusCode.InvalidCredentials,
      statusMessage: 'invalid email or password',
    });
  }
}
