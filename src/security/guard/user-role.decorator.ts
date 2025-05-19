import { UserRoleType } from '@/domain/enum/user-role.enum';
import { SetMetadata } from '@nestjs/common';

export const Roles = (role: UserRoleType) => SetMetadata('role', role);
