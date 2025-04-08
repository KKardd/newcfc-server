import { IsEmail, IsEnum, IsNumber, IsString } from 'class-validator';

import { TenantUserRole } from '@/domain/enum/tenant-user-role.enum';

export class TokenPayload<T> {
  iss: string;
  sub: string;
  jti: string;
  payload: T;
  iat?: number;
  exp?: number;
}

export class UserAccessTokenPayload {
  @IsNumber()
  tenantId: number;

  @IsNumber()
  userId: number;

  @IsEnum(TenantUserRole, { each: true })
  roles: TenantUserRole[];

  @IsEmail()
  email: string;

  @IsString()
  name: string;
}

export class UserRefreshTokenPayload {
  @IsNumber()
  tenantId: number;

  @IsNumber()
  userId: number;
}
