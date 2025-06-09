import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchNoticeDto } from '@/adapter/inbound/dto/request/notice/search-notice.dto';
import { NoticeResponseDto } from '@/adapter/inbound/dto/response/notice/notice-response.dto';
import { Notice } from '@/domain/entity/notice.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';

export abstract class NoticeServiceOutPort {
  abstract findAll(searchNotice: SearchNoticeDto, paginationQuery: PaginationQuery): Promise<[NoticeResponseDto[], number]>;

  abstract findById(id: number): Promise<Notice | null>;

  abstract save(notice: Notice): Promise<void>;

  abstract update(id: number, notice: Partial<Notice>): Promise<void>;

  abstract updateStatus(id: number, status: DataStatus): Promise<void>;
}
