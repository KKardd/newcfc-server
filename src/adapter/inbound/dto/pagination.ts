import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Max } from 'class-validator';

export class PaginationQuery {
  @ApiPropertyOptional({ type: Number, default: 1, description: 'Page number' })
  @IsInt()
  @IsOptional()
  page: number = 1;

  @ApiPropertyOptional({ type: Number, default: 20, description: 'Number of items per page' })
  @Transform(({ value }) => {
    const number = parseInt(value, 10);

    return number === -1 ? undefined : number;
  })
  @IsInt()
  @Max(100)
  @IsOptional()
  countPerPage?: number = 20;

  get skip(): number {
    if (this.countPerPage === undefined) {
      return 0;
    }

    return (this.page - 1) * this.countPerPage;
  }
}

type PaginationParameters = {
  paginationQuery: PaginationQuery;
  totalCount: number;
};

export class Pagination {
  @ApiProperty({ type: Number })
  readonly page: number;

  @ApiProperty({ type: Number })
  readonly countPerPage: number;

  @ApiProperty({ type: Number })
  readonly totalCount: number;

  @ApiProperty({ type: Number })
  readonly pageCount: number;

  @ApiProperty({ type: Boolean })
  readonly hasPrevPage: boolean;

  @ApiProperty({ type: Boolean })
  readonly hasNextPage: boolean;

  constructor({ paginationQuery, totalCount }: PaginationParameters) {
    this.page = paginationQuery.page;
    this.countPerPage = paginationQuery.countPerPage === undefined ? -1 : paginationQuery.countPerPage;
    this.totalCount = totalCount;

    if (this.countPerPage === -1) {
      this.pageCount = 1;
      this.hasPrevPage = false;
      this.hasNextPage = false;
    } else {
      this.pageCount = Math.ceil(this.totalCount / this.countPerPage);
      this.hasPrevPage = this.page > 1;
      this.hasNextPage = this.page < this.pageCount;
    }
  }
}
