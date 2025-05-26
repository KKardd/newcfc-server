import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { DataStatus } from '@/domain/enum/data-status.enum';
import { UserRoleType } from '@/domain/enum/user-role.enum';

export class AdminResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  phone: string;

  @ApiProperty()
  @Expose()
  role: UserRoleType;

  @ApiProperty()
  @Expose()
  status: DataStatus;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
