import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { ChauffeurStatus } from '@/domain/enum/chauffeur-status.enum';
import { ChauffeurType } from '@/domain/enum/chauffeur-type.enum';

export class ChauffeurProfileResponseDto {
  @ApiProperty({ description: '기사 ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '기사 이름' })
  @Expose()
  name: string;

  @ApiProperty({ description: '프로필 사진 URL', required: false })
  @Expose()
  profileImageUrl: string | null;

  @ApiProperty({ description: '기사 타입', enum: ChauffeurType, required: false })
  @Expose()
  type: ChauffeurType | null;

  @ApiProperty({ description: '차량 배정 여부' })
  @Expose()
  isVehicleAssigned: boolean;

  @ApiProperty({ description: '기사 상태', enum: ChauffeurStatus })
  @Expose()
  chauffeurStatus: ChauffeurStatus;

  @ApiProperty({ description: '실시간 배차 ID', required: false })
  @Expose()
  realTimeDispatchId: number | null;
}
