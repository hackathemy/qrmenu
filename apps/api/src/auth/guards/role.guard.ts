import { Role, TokenPayload } from '@hackathon-qrmenu/type';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { QueryBus } from '@nestjs/cqrs';
import { CommonError, throwError } from 'src/common/error';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private queryBus: QueryBus,
  ) {}

  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());

    if (!roles || !roles.length) {
      return true;
    }

    const user = context.switchToHttp().getRequest().user as TokenPayload;

    if (roles.findIndex((role) => user?.roles.includes(role)) >= 0) {
      return true;
    }

    /** 권한 부족 FRRBIDDEN */
    throwError(CommonError.ERR_FORBIDDEN, 'Insufficient privileges');
  }
}
