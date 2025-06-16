import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateGarageDto {
  @ApiProperty({ description: '차고지 이름', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '차고지 주소', required: false })
  @IsOptional()
  @IsString()
  address?: string;
}
