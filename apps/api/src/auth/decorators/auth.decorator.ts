import {
  HttpStatus,
  SetMetadata,
  UseGuards,
  applyDecorators,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Roles } from './roles.decorator';
import { RoleGuard } from '../guards/role.guard';
import { Role } from '@hackathon-qrmenu/type';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    ApiBearerAuth(),
    SetMetadata('auth', true),
    Roles(roles),
    UseGuards(RoleGuard),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
    }),
  );
}
