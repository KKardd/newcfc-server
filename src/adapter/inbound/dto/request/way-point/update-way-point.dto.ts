import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateWayPointDto {
  @IsOptional()
  @IsNumber()
  reservationId?: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}
