import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class SearchAvailableChauffeursDto {
  @ApiProperty({ description: '운행 시작 시간' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startTime: Date;

  @ApiProperty({ description: '운행 종료 시간' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endTime: Date;
}
