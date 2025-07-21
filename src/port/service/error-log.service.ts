import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { Pagination, PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchErrorLog } from '@/adapter/inbound/dto/request/errorlog/search-errorlog';
import { ErrorLogResponseDto } from '@/adapter/inbound/dto/response/errorlog/errorlog-response.dto';
import { ErrorLog } from '@/domain/entity/error-log.entity';
import { ErrorLogServiceInPort } from '@/port/inbound/error-log-service.in-port';
import { ErrorLogServiceOutPort } from '@/port/outbound/error-log-service.out-port';
import {} from '@/validate/serialization';

@Injectable()
export class ErrorLogService implements ErrorLogServiceInPort {
  constructor(private readonly errorLogServiceOutPort: ErrorLogServiceOutPort) {}

  async save(errorLog: ErrorLog): Promise<void> {
    await this.errorLogServiceOutPort.save(errorLog);
  }

  async findAll(
    searchErrorLog: SearchErrorLog,
    paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<ErrorLogResponseDto>> {
    const [errorLogs, totalCount] = await this.errorLogServiceOutPort.findAll(searchErrorLog, paginationQuery);
    const pagination = new Pagination({ totalCount, paginationQuery });

    const errorlogs = plainToInstance(ErrorLogResponseDto, errorLogs);

    return new PaginationResponse(errorlogs, pagination);
  }
}
