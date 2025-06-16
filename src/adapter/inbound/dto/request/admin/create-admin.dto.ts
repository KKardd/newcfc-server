import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { UserRoleType } from '@/domain/enum/user-role.enum';

export class CreateAdminDto {
  @ApiProperty({ description: '이메일' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: '이름' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: '핸드폰 번호' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ description: '생년월일' })
  @IsNotEmpty()
  @IsString()
  birthDate: string;

  @ApiProperty({ description: '비밀번호' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ description: '관리자 권한', enum: UserRoleType })
  @IsNotEmpty()
  @IsEnum(UserRoleType)
  role: UserRoleType;
}
