import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches, IsBoolean } from 'class-validator';

import { ChauffeurType } from '@/domain/enum/chauffeur-type.enum';

export class CreateChauffeurDto {
  @ApiProperty({ description: '기사 이름' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: '핸드폰 번호' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ description: '생년월일 (YYMMDD 형식)' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{6}$/, { message: '생년월일은 6자리 숫자여야 합니다 (YYMMDD)' })
  birthDate: string;

  @ApiProperty({ description: '기사 타입', enum: ChauffeurType })
  @IsNotEmpty()
  @IsEnum(ChauffeurType)
  type: ChauffeurType;

  @ApiProperty({ description: '차량 배정 여부', default: false })
  @IsOptional()
  @IsBoolean()
  isVehicleAssigned?: boolean;

  @ApiProperty({ description: '차량 ID', required: false })
  @IsOptional()
  vehicleId?: number;
}
