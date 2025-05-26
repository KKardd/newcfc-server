import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

import { DataStatus } from '@/domain/enum/data-status.enum';
import { UserRoleType } from '@/domain/enum/user-role.enum';

export class SearchAdminDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(UserRoleType)
  role?: UserRoleType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(DataStatus)
  status?: DataStatus;
}
