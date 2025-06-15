import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty } from 'class-validator';

import { ChauffeurStatus } from '@/domain/enum/chauffeur-status.enum';

export class ChangeChauffeurStatusDto {
  @ApiProperty({ description: '이전 상태' })
  @IsNotEmpty()
  @IsEnum(ChauffeurStatus)
  prevStatus: ChauffeurStatus;

  @ApiProperty({ description: '변경할 상태' })
  @IsNotEmpty()
  @IsEnum(ChauffeurStatus)
  updateStatus: ChauffeurStatus;
}
