import { HttpStatus } from '@nestjs/common';

export function throwError(errObject: ErrorObject, message?: string): never {
  throw newError(errObject, message);
}

export function newError(
  errObject: ErrorObject,
  message?: string,
): AppError {
  const error = new AppError(
    errObject.code,
    errObject.domain,
    errObject.status,
    message || errObject.message,
  );

  return error;
}

export class AppError implements ErrorObject {
  constructor(
    public code: number,
    public domain: string,
    public status?: number,
    public message?: string,
  ) {}
}

export interface ErrorObject {
  code: number;
  domain: string;
  status?: number;
  message?: string;
}

export function registerError(
  domain: string,
  code: number,
  message?: string,
  status: number = 500,
): ErrorObject {
  return {
    code,
    domain,
    status,
    message,
  };
}

export class CommonError {
  public static ERR_FORBIDDEN = registerError(
    '',
    1,
    'Forbidden',
    HttpStatus.FORBIDDEN,
  );

  public static ERR_NOT_FOUND = registerError(
    '',
    2,
    'Not Found',
    HttpStatus.NOT_FOUND,
  );

  public static ERR_UNAUTHORIZED = registerError(
    '',
    3,
    'UNAUTHORIZED',
    HttpStatus.UNAUTHORIZED,
  );

  public static ERR_BAD_REQUEST = registerError(
    '',
    4,
    'BAD_REQUEST',
    HttpStatus.BAD_REQUEST,
  );

  public static ERR_UNPROCESSABLE = registerError(
    '',
    5,
    'UNPROCESSABLE',
    HttpStatus.UNPROCESSABLE_ENTITY,
  );
}
