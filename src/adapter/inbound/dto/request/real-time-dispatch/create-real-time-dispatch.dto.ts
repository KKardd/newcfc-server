import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRealTimeDispatchDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  departureAddress: string;

  @IsNotEmpty()
  @IsString()
  destinationAddress: string;
}
