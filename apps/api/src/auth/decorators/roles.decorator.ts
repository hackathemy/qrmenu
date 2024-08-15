import { Role } from '@hackathemy-qrmenu/type';
import { SetMetadata } from '@nestjs/common';

export const Roles = (roles: Role[]) => SetMetadata('roles', roles);
