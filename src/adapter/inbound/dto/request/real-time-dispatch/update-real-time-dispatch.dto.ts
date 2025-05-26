import { IsOptional, IsString } from 'class-validator';

export class UpdateRealTimeDispatchDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  departureAddress?: string;

  @IsOptional()
  @IsString()
  destinationAddress?: string;
}
