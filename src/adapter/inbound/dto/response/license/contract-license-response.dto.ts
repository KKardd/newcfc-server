import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { ContractStatus } from '@/domain/enum/contract-status.enum';

export class ContractLicenseResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  contractId: number;

  @ApiProperty()
  @Expose()
  tenantId: number;

  @ApiProperty()
  @Expose()
  tenantName: string;

  @ApiProperty()
  @Expose()
  itemId: number;

  @ApiProperty()
  @Expose()
  grade: string;

  @ApiProperty()
  @Expose()
  account: number;

  @ApiProperty()
  @Expose()
  invite: boolean;

  @ApiProperty()
  @Expose()
  activityData: boolean;

  @ApiProperty()
  @Expose()
  scope1n2: boolean;

  @ApiProperty()
  @Expose()
  scope3: boolean;

  @ApiProperty()
  @Expose()
  consulting: number;

  @ApiProperty()
  @Expose()
  customizing: boolean;

  @ApiProperty({ type: () => ContractStatus, enum: ContractStatus })
  @Expose()
  status: ContractStatus;

  @ApiProperty()
  @Expose()
  startAt: Date;

  @ApiProperty()
  @Expose()
  expiredAt: Date;
}
