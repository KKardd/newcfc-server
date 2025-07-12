import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchNoticeDto } from '@/adapter/inbound/dto/request/notice/search-notice.dto';
import { Notice } from '@/domain/entity/notice.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { UpdateResult } from 'typeorm';

export abstract class NoticeServiceOutPort {
  abstract findAll(searchNotice: SearchNoticeDto, paginationQuery: PaginationQuery): Promise<[Notice[], number]>;

  abstract findPopupNotices(): Promise<Notice[]>;

  abstract findByNoticeId(id: number): Promise<Notice | null>;

  abstract save(notice: Notice): Promise<void>;

  abstract update(id: number, notice: Partial<Notice>): Promise<UpdateResult>;

  abstract updateStatus(id: number, status: DataStatus): Promise<UpdateResult>;
}
