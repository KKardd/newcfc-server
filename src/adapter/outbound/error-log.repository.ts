import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchErrorLog } from '@/adapter/inbound/dto/request/errorlog/search-errorlog';
import { ErrorLogResponseDto } from '@/adapter/inbound/dto/response/errorlog/errorlog-response.dto';
import { ErrorLog } from '@/domain/entity/error-log.entity';
import { ErrorLogServiceOutPort } from '@/port/outbound/error-log-service.out-port';

@Injectable()
export class ErrorLogRepository implements ErrorLogServiceOutPort {
  constructor(
    @InjectRepository(ErrorLog)
    private readonly errorLogRepository: Repository<ErrorLog>,
  ) {}

  async save(errorLog: ErrorLog): Promise<void> {
    await this.errorLogRepository.save(errorLog);
  }

  async findAll(searchErrorLog: SearchErrorLog, paginationQuery: PaginationQuery): Promise<[ErrorLogResponseDto[], number]> {
    const queryBuilder = this.errorLogRepository.createQueryBuilder('error_log').select('error_log.*');

    if (searchErrorLog.requestUrl) {
      queryBuilder.andWhere('error_log.request_url LIKE :requestUrl', { requestUrl: `%${searchErrorLog.requestUrl}%` });
    }

    if (searchErrorLog.method) {
      queryBuilder.andWhere('error_log.method = :method', { method: searchErrorLog.method });
    }

    if (searchErrorLog.status) {
      queryBuilder.andWhere('error_log.status = :status', { status: searchErrorLog.status });
    }

    queryBuilder.orderBy('error_log.id', 'DESC').offset(paginationQuery.skip).limit(paginationQuery.countPerPage);

    const errorLogs = await queryBuilder.getRawMany();
    const totalCount = await queryBuilder.getCount();

    const errorLogsResponse: ErrorLogResponseDto[] = errorLogs.map((errorLog) => ({
      id: errorLog.id,
      service: errorLog.service,
      requestUrl: errorLog.request_url,
      accessToken: errorLog.access_token,
      method: errorLog.method,
      header: errorLog.header,
      param: errorLog.param,
      query: errorLog.query,
      body: errorLog.body,
      status: errorLog.status,
      responseBody: errorLog.response_body,
      stackTrace: errorLog.stack_trace,
      elapsedTime: errorLog.elapsed_time,
      createdAt: errorLog.created_at,
    }));

    return [errorLogsResponse, totalCount];
  }
}
