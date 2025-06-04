import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { UserRoleType } from '@/domain/enum/user-role.enum';

export class CreateAdminDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  birthDate: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEnum(UserRoleType)
  role: UserRoleType;
}
