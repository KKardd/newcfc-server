import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, IsBoolean } from 'class-validator';

import { UserRoleType } from '@/domain/enum/user-role.enum';

export class UpdateAdminDto {
  @ApiProperty({ description: '이메일', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: '이름', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '핸드폰 번호', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: '비밀번호', required: false })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ description: '관리자 권한', enum: UserRoleType, required: false })
  @IsOptional()
  @IsEnum(UserRoleType)
  role?: UserRoleType;

  @ApiProperty({ description: '승인 여부', required: false })
  @IsOptional()
  @IsBoolean()
  approved?: boolean;
}
