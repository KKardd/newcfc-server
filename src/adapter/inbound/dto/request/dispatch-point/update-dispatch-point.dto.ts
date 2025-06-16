import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateDispatchPointDto {
  @ApiProperty({ description: '배차 지점 이름', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '배차 지점 주소', required: false })
  @IsOptional()
  @IsString()
  address?: string;
}
