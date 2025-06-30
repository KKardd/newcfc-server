import { IsEmail, IsEnum, IsNumber, IsString, ValidateIf } from 'class-validator';

import { UserRoleType } from '@/domain/enum/user-role.enum';

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
  userId: number;

  @IsEnum(UserRoleType, { each: true })
  roles: UserRoleType[];

  @IsString()
  email: string;

  @IsString()
  name: string;
}

export class UserRefreshTokenPayload {
  @IsNumber()
  userId: number;
}
