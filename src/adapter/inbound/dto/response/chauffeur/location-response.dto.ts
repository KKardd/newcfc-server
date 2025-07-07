import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LocationResponseDto {
  @ApiProperty({ description: '위도', required: false })
  @Expose()
  latitude: number | null;

  @ApiProperty({ description: '경도', required: false })
  @Expose()
  longitude: number | null;
}
