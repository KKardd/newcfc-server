import { IsOptional, IsString } from 'class-validator';

export class UpdateGarageDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
