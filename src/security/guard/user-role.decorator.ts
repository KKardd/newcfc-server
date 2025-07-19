import { UserRoleType } from '@/domain/enum/user-role.enum';
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: UserRoleType[]) => SetMetadata('roles', roles);
