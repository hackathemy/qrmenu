import { registerError } from 'src/common/error';
import { AccountsConstant } from './accounts.constant';
import { HttpStatus } from '@nestjs/common';

export class AccountsError {
  public static CONFLICT_USERNAME = registerError(
    AccountsConstant.MODULE_NAME,
    1,
    'username already in use',
    HttpStatus.CONFLICT,
  );

  public static CONFLICT_EMAIL = registerError(
    AccountsConstant.MODULE_NAME,
    2,
    'email already in use',
    HttpStatus.CONFLICT,
  );

  public static FAILED_LOGIN = registerError(
    AccountsConstant.MODULE_NAME,
    3,
    'failed to login',
    HttpStatus.UNAUTHORIZED,
  );

  public static FAILED_REFRESH_TOKEN = registerError(
    AccountsConstant.MODULE_NAME,
    4,
    'failed to refresh token',
    HttpStatus.UNPROCESSABLE_ENTITY,
  );

  public static CONFLICT_PHONE_NUMBER = registerError(
    AccountsConstant.MODULE_NAME,
    5,
    'phoneNumber already in use',
    HttpStatus.CONFLICT,
  );

  public static FAILED_PHONE_NUMBER_AUTH = registerError(
    AccountsConstant.MODULE_NAME,
    6,
    'failed to phoneNumber auth',
    HttpStatus.UNPROCESSABLE_ENTITY,
  );

  public static NOT_FOUND_ACCOUNT = registerError(
    AccountsConstant.MODULE_NAME,
    7,
    'not found a account',
    HttpStatus.NOT_FOUND,
  );

  public static FAILED_EMAIL_AUTH = registerError(
    AccountsConstant.MODULE_NAME,
    8,
    'failed to email auth',
    HttpStatus.UNPROCESSABLE_ENTITY,
  );

  public static DIFF_PHONE_IN_EMAIL = registerError(
    AccountsConstant.MODULE_NAME,
    9,
    'diff phone in email',
    HttpStatus.UNPROCESSABLE_ENTITY,
  );

  public static REJECTED_STATUS = registerError(
    AccountsConstant.MODULE_NAME,
    10,
    'you can not login to this account',
    HttpStatus.FORBIDDEN,
  );

  public static INVLIAD_CEONAME = registerError(
    AccountsConstant.MODULE_NAME,
    11,
    '',
    HttpStatus.BAD_REQUEST,
  );

  public static INVLIAD_PASSWORD = registerError(
    AccountsConstant.MODULE_NAME,
    12,
    '',
    HttpStatus.BAD_REQUEST,
  );
}
