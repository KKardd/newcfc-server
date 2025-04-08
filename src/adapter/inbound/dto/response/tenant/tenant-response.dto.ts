import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { TenantLifecycle } from '@/domain/enum/tenant-life-cycle.enum';

export default class TenantResponseDto {
  @ApiProperty({ type: Number })
  @Expose()
  id: number;

  @ApiProperty({ type: Number, description: 'tenant id' })
  @Expose()
  tenantId: number;

  @ApiProperty({ type: String, description: 'tenant UUID' })
  @Expose()
  uuid: string;

  @ApiProperty({ type: String, description: '테넌트 이름' })
  @Expose()
  name: string;

  @ApiProperty({ enum: TenantLifecycle, description: '데이터 상태' })
  @Expose()
  status: TenantLifecycle;

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
