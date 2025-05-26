import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

import { UserRoleType } from '@/domain/enum/user-role.enum';

export class UpdateAdminDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsEnum(UserRoleType)
  role?: UserRoleType;
}
