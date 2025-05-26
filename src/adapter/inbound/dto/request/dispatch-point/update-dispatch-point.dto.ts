import { IsOptional, IsString } from 'class-validator';

export class UpdateDispatchPointDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
