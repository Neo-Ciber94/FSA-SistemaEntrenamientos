import { ResponseBody, StatusCode } from '../../../shared';
import { Response } from 'express';

export function helper(response: Response) {
  return new ResponseHelper(response);
}

export class ResponseHelper {
  constructor(private response: Response) {}

  send<T, ResBody extends ResponseBody<T>>(code: number, body: ResBody) {
    return this.response.status(code).json(body) as Response<ResBody>;
  }

  success<T>(data?: T) {
    return this.send(200, {
      success: true,
      statusCode: StatusCode.Success,
      statusMessage: 'Success',
      data,
    });
  }

  emailExist() {
    return this.send(409, {
      success: false,
      statusCode: StatusCode.EmailAlreadyExist,
      statusMessage: 'Email already exists',
    });
  }
}
