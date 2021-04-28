import { StatusCode } from '.';

export interface ResponseBody<T = any> {
  success: boolean;
  statusCode: StatusCode;
  statusMessage: string;
  data?: T;
}
