import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { DataStatus } from '@/domain/enum/data-status.enum';
import { UserRoleType } from '@/domain/enum/user-role.enum';

export class AdminResponseDto {
  @ApiProperty({ description: '관리자 ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '이메일' })
  @Expose()
  email: string;

  @ApiProperty({ description: '이름' })
  @Expose()
  name: string;

  @ApiProperty({ description: '핸드폰 번호' })
  @Expose()
  phone: string;

  @ApiProperty({ description: '관리자 권한', enum: UserRoleType })
  @Expose()
  role: UserRoleType;

  @ApiProperty({ description: '데이터 상태', enum: DataStatus })
  @Expose()
  status: DataStatus;

  @ApiProperty({ description: '생성일' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: '수정일' })
  @Expose()
  updatedAt: Date;
}
