import { IErrorResponse } from '../models/ResponseBodies';

export function isErrorReponse(obj: any): obj is IErrorResponse {
  return 'error' in obj && 'statusCode' in obj;
}
