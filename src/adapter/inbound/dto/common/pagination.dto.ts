import { ApiProperty } from '@nestjs/swagger';

import { Pagination } from '@/adapter/inbound/dto/pagination';

export class PaginationResponse<TData> {
  @ApiProperty({ type: Pagination })
  pagination: Pagination;

  @ApiProperty()
  data: TData[];

  constructor(data: TData[], pagination: Pagination) {
    this.data = data;
    this.pagination = pagination;
  }
}
