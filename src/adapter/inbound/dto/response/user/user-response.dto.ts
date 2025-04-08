import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { UserLifecycle } from '@/domain/enum/user-life-cycle.enum';

export class UserResponseDto {
  @ApiProperty({ type: Number })
  @Expose()
  id: number;

  @ApiProperty({ type: Number })
  @Expose()
  userId: number;

  @ApiProperty({ type: String, format: 'uuid' })
  @Expose()
  uuid: string;

  @ApiProperty({ type: String })
  @Expose()
  name: string;

  @ApiProperty({ type: String, format: 'email' })
  @Expose()
  email: string;

  @ApiProperty({ type: String })
  @Expose()
  departmentName: string;

  @ApiProperty({ type: Number })
  @Expose()
  tenantId: number;

  @ApiProperty({ enum: UserLifecycle })
  @Expose()
  status: UserLifecycle;

  @ApiProperty({ type: Date, nullable: true })
  @Expose()
  lastLoginAt: Date | null;

  @ApiProperty({ type: Number })
  @Expose()
  createdBy: number;

  @ApiProperty({ type: Date })
  @Expose()
  createdAt: Date;

  @ApiProperty({ type: Number })
  @Expose()
  updatedBy: number;

  @ApiProperty({ type: Date })
  @Expose()
  updatedAt: Date;
}
