import { TokenPayload } from '@hackathon/type';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const auth = this.reflector.get<boolean>('auth', context.getHandler());

    const token = this.extractTokenFromHeader(request);

    if (auth && !token) {
      return false;
    }

    const [result, user] = auth
      ? await this.verifiyRequiredsLogged(token)
      : await this.verifyPublic(token);

    request['user'] = user;

    return result;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [
      null,
      null,
    ];

    return type === 'Bearer' ? token : undefined;
  }

  private async verifiyRequiredsLogged(
    token: string,
  ): Promise<[boolean, TokenPayload | null]> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      return [true, payload];
    } catch {
      return [false, null];
    }
  }

  private async verifyPublic(
    token: string,
  ): Promise<[boolean, TokenPayload | null]> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      return [true, payload];
    } catch {
      return [true, null];
    }
  }
}
