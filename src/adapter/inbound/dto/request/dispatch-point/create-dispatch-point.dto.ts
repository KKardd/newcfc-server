import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDispatchPointDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}
