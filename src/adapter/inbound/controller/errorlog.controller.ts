import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchErrorLog } from '@/adapter/inbound/dto/request/errorlog/search-errorlog';
import { ErrorLogResponseDto } from '@/adapter/inbound/dto/response/errorlog/errorlog-response.dto';
import { ApiSuccessResponse } from '@/adapter/inbound/dto/swagger.decorator';
import { ErrorLogServiceInPort } from '@/port/inbound/error-log-service.in-port';

@ApiTags('ErrorLog')
@Controller('errorlogs')
export class ErrorLogController {
  constructor(private readonly errorLogService: ErrorLogServiceInPort) {}

  @ApiOperation({ summary: 'error log search' })
  @ApiSuccessResponse(200, ErrorLogResponseDto, { paginated: true })
  @Get()
  async findAll(
    @Query() searchErrorLog: SearchErrorLog,
    @Query() paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<ErrorLogResponseDto>> {
    return this.errorLogService.findAll(searchErrorLog, paginationQuery);
  }
}
