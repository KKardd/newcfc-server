import { Expose } from 'class-transformer';
import { ChauffeurStatus } from '@/domain/enum/chauffeur-status.enum';
import { ChauffeurType } from '@/domain/enum/chauffeur-type.enum';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { UserRoleType } from '@/domain/enum/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ChauffeurResponseDto {
  @ApiProperty({ description: '기사 ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '기사 이름' })
  @Expose()
  name: string;

  @ApiProperty({ description: '핸드폰 번호' })
  @Expose()
  phone: string;

  @ApiProperty({ description: '생년월일' })
  @Expose()
  birthDate: string;

  @ApiProperty({ description: '기사 타입', enum: ChauffeurType })
  @Expose()
  type: ChauffeurType;

  @ApiProperty({ description: '기사 상태', enum: ChauffeurStatus })
  @Expose()
  chauffeurStatus: ChauffeurStatus;

  @ApiProperty({ description: '차량 ID' })
  @Expose()
  vehicleId: number | null;

  @ApiProperty({ description: '사용자 권한', enum: UserRoleType })
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
