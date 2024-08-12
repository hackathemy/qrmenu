import { Role } from '@hackathon-qrmenu/type';
import { SetMetadata } from '@nestjs/common';

export const Roles = (roles: Role[]) => SetMetadata('roles', roles);
