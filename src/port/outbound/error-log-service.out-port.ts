import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchErrorLog } from '@/adapter/inbound/dto/request/errorlog/search-errorlog';
import { ErrorLog } from '@/domain/entity/error-log.entity';

export abstract class ErrorLogServiceOutPort {
  abstract save(saveUser: ErrorLog): Promise<void>;

  abstract findAll(searchErrorLog: SearchErrorLog, paginationQuery: PaginationQuery): Promise<[ErrorLog[], number]>;
}
