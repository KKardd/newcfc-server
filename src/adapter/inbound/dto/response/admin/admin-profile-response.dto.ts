import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { UserRoleType } from '@/domain/enum/user-role.enum';

export class AdminProfileResponseDto {
  @ApiProperty({ description: '관리자 ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '이름' })
  @Expose()
  name: string;

  @ApiProperty({ description: '승인 여부' })
  @Expose()
  approved: boolean;

  @ApiProperty({ description: '관리자 권한', enum: UserRoleType })
  @Expose()
  role: UserRoleType;
}
