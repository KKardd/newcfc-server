import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchErrorLog } from '@/adapter/inbound/dto/request/errorlog/search-errorlog';
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

  async findAll(searchErrorLog: SearchErrorLog, paginationQuery: PaginationQuery): Promise<[ErrorLog[], number]> {
    const queryBuilder = this.errorLogRepository.createQueryBuilder('ErrorLog');

    if (searchErrorLog.requestUrl) {
      queryBuilder.andWhere('ErrorLog.requestUrl = :requestUrl', { requestUrl: searchErrorLog.requestUrl });
    }

    if (searchErrorLog.method) {
      queryBuilder.andWhere('ErrorLog.method = :method', { method: searchErrorLog.method });
    }

    if (searchErrorLog.status) {
      queryBuilder.andWhere('ErrorLog.status = :status', { status: searchErrorLog.status });
    }

    queryBuilder.orderBy('ErrorLog.id', 'DESC').skip(paginationQuery.skip).take(paginationQuery.countPerPage);

    const [errorLogs, totalCount] = await queryBuilder.getManyAndCount();

    return [errorLogs, totalCount];
  }
}
