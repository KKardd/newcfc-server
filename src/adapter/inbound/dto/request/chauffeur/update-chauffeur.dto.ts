import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { ChauffeurStatus } from '@/domain/enum/chauffeur-status.enum';
import { ChauffeurType } from '@/domain/enum/chauffeur-type.enum';

export class UpdateChauffeurDto {
  @ApiProperty({ description: '기사 이름', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '핸드폰 번호', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: '생년월일 (YYMMDD)', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^\d{6}$/, { message: '생년월일은 6자리 숫자여야 합니다 (YYMMDD)' })
  birthDate?: string;

  @ApiProperty({ description: '기사 타입', enum: ChauffeurType, required: false })
  @IsOptional()
  @IsEnum(ChauffeurType)
  type?: ChauffeurType;

  @ApiProperty({ description: '기사 상태', enum: ChauffeurStatus, required: false })
  @IsOptional()
  @IsEnum(ChauffeurStatus)
  chauffeurStatus?: ChauffeurStatus;

  @ApiProperty({ description: '차량 ID', required: false })
  @IsOptional()
  vehicleId?: number;
}
