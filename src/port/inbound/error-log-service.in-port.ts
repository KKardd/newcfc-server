import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchErrorLog } from '@/adapter/inbound/dto/request/errorlog/search-errorlog';
import { ErrorLogResponseDto } from '@/adapter/inbound/dto/response/errorlog/errorlog-response.dto';
import { ErrorLog } from '@/domain/entity/error-log.entity';

export abstract class ErrorLogServiceInPort {
  abstract save(errorLog: ErrorLog): Promise<void>;

  abstract findAll(
    searchErrorLog: SearchErrorLog,
    paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<ErrorLogResponseDto>>;
}
