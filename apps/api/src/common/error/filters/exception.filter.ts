import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AppError } from '..';

@Catch(AppError)
export class AppExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: AppError, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const resBody = {
      domain: exception.domain,
      code: exception.code,
      message: exception.message || 'Unknown error',
    };

    httpAdapter.reply(ctx.getResponse(), resBody, exception.status);
  }
}
