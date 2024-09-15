// Define predicates for type-assertions.
import { IErrorResponse } from '../models/ResponseBodies';

// Return true if object is of shape IErrorResponse else false.
export function isErrorReponse(obj: any): obj is IErrorResponse {
  return 'error' in obj && 'statusCode' in obj;
}
