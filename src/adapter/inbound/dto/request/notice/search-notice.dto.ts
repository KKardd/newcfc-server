import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { DataStatus } from '@/domain/enum/data-status.enum';

export class SearchNoticeDto {
  @ApiProperty({ description: '제목', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: '작성자', required: false })
  @IsString()
  @IsOptional()
  author?: string;

  @ApiProperty({ enum: DataStatus, description: '상태', required: false })
  @IsEnum(DataStatus)
  @IsOptional()
  status?: DataStatus;

  @ApiProperty({ description: '검색 시작일', required: false })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ description: '검색 종료일', required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}
