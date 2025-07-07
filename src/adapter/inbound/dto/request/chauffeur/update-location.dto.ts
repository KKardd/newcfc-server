import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class UpdateLocationDto {
  @ApiProperty({
    description: '위도',
    minimum: -90,
    maximum: 90,
    example: 37.5665,
  })
  @IsNotEmpty({ message: '위도를 입력해주세요.' })
  @IsNumber({}, { message: '위도는 숫자여야 합니다.' })
  @Min(-90, { message: '위도는 -90도 이상이어야 합니다.' })
  @Max(90, { message: '위도는 90도 이하여야 합니다.' })
  latitude: number;

  @ApiProperty({
    description: '경도',
    minimum: -180,
    maximum: 180,
    example: 126.978,
  })
  @IsNotEmpty({ message: '경도를 입력해주세요.' })
  @IsNumber({}, { message: '경도는 숫자여야 합니다.' })
  @Min(-180, { message: '경도는 -180도 이상이어야 합니다.' })
  @Max(180, { message: '경도는 180도 이하여야 합니다.' })
  longitude: number;
}
