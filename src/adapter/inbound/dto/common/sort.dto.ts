/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum } from 'class-validator';

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class SortQuery {
  @ApiPropertyOptional({ title: '정렬 기준', enum: [] })
  sortBy: any;

  @ApiPropertyOptional({ title: '정렬 순서', enum: SortDirection, default: SortDirection.ASC })
  @IsEnum(SortDirection)
  sortDirection: SortDirection = SortDirection.ASC;
}
