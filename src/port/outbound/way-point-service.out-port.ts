import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchWayPointDto } from '@/adapter/inbound/dto/request/way-point/search-way-point.dto';
import { WayPoint } from '@/domain/entity/way-point.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { UpdateResult } from 'typeorm';

export abstract class WayPointServiceOutPort {
  abstract findAll(searchWayPoint: SearchWayPointDto, paginationQuery: PaginationQuery): Promise<[WayPoint[], number]>;

  abstract findById(id: number): Promise<WayPoint | null>;

  abstract save(wayPoint: WayPoint): Promise<WayPoint>;

  abstract update(id: number, wayPoint: Partial<WayPoint>): Promise<UpdateResult>;

  abstract updateStatus(id: number, status: DataStatus): Promise<UpdateResult>;
}
