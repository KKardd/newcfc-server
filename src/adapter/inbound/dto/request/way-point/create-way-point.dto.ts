import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateWayPointDto {
  @IsNotEmpty()
  @IsNumber()
  reservationId: number;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsNumber()
  order: number;
}
