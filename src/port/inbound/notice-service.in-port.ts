import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateNoticeDto } from '@/adapter/inbound/dto/request/notice/create-notice.dto';
import { SearchNoticeDto } from '@/adapter/inbound/dto/request/notice/search-notice.dto';
import { UpdateNoticeDto } from '@/adapter/inbound/dto/request/notice/update-notice.dto';
import { NoticeResponseDto } from '@/adapter/inbound/dto/response/notice/notice-response.dto';

export abstract class NoticeServiceInPort {
  abstract search(
    searchNotice: SearchNoticeDto,
    paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<NoticeResponseDto>>;

  abstract detail(id: number): Promise<NoticeResponseDto>;

  abstract create(createNotice: CreateNoticeDto): Promise<void>;

  abstract update(id: number, updateNotice: UpdateNoticeDto): Promise<void>;

  abstract delete(id: number): Promise<void>;
}
