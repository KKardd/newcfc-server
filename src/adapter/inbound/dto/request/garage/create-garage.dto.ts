import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGarageDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}
