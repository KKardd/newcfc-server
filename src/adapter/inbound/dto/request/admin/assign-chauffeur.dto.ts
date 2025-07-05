import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AssignChauffeurDto {
  @ApiProperty({ description: '기사 ID' })
  @IsNotEmpty()
  @IsNumber()
  chauffeurId: number;

  @ApiProperty({ description: '운행 ID' })
  @IsNotEmpty()
  @IsNumber()
  operationId: number;
}
