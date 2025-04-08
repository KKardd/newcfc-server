import { SetMetadata } from '@nestjs/common';

import { TenantUserRole } from '@/domain/enum/tenant-user-role.enum';

export const Roles = (...roles: TenantUserRole[]) => SetMetadata('roles', roles);
