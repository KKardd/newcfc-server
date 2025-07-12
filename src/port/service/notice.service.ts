import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { Pagination, PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateNoticeDto } from '@/adapter/inbound/dto/request/notice/create-notice.dto';
import { SearchNoticeDto } from '@/adapter/inbound/dto/request/notice/search-notice.dto';
import { UpdateNoticeDto } from '@/adapter/inbound/dto/request/notice/update-notice.dto';
import { NoticeResponseDto } from '@/adapter/inbound/dto/response/notice/notice-response.dto';
import { Notice } from '@/domain/entity/notice.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { NoticeServiceInPort } from '@/port/inbound/notice-service.in-port';
import { NoticeServiceOutPort } from '@/port/outbound/notice-service.out-port';
import { classTransformDefaultOptions } from '@/validate/serialization';

@Injectable()
export class NoticeService implements NoticeServiceInPort {
  constructor(private readonly noticeServiceOutPort: NoticeServiceOutPort) {}

  async search(searchNotice: SearchNoticeDto, paginationQuery: PaginationQuery): Promise<PaginationResponse<NoticeResponseDto>> {
    const [notices, totalCount] = await this.noticeServiceOutPort.findAll(searchNotice, paginationQuery);
    const pagination = new Pagination({ totalCount, paginationQuery });

    const response = plainToInstance(NoticeResponseDto, notices, classTransformDefaultOptions);

    return new PaginationResponse(response, pagination);
  }

  async getPopupNotices(): Promise<NoticeResponseDto[]> {
    const notices = await this.noticeServiceOutPort.findPopupNotices();
    return plainToInstance(NoticeResponseDto, notices, classTransformDefaultOptions);
  }

  async detail(id: number): Promise<NoticeResponseDto> {
    const notice = await this.noticeServiceOutPort.findByNoticeId(id);
    return plainToInstance(NoticeResponseDto, notice, classTransformDefaultOptions);
  }

  async create(createNotice: CreateNoticeDto): Promise<void> {
    const notice = new Notice();
    notice.title = createNotice.title;
    notice.content = createNotice.content;
    notice.adminId = createNotice.adminId;
    notice.isPopup = createNotice.isPopup || false;
    notice.popupStartDate = createNotice.popupStartDate ? new Date(createNotice.popupStartDate) : null;
    notice.popupEndDate = createNotice.popupEndDate ? new Date(createNotice.popupEndDate) : null;
    await this.noticeServiceOutPort.save(notice);
  }

  async update(id: number, updateNotice: UpdateNoticeDto): Promise<void> {
    const updateData: Partial<Notice> = {
      title: updateNotice.title,
      content: updateNotice.content,
      isPopup: updateNotice.isPopup,
    };

    if (updateNotice.popupStartDate) {
      updateData.popupStartDate = new Date(updateNotice.popupStartDate);
    }

    if (updateNotice.popupEndDate) {
      updateData.popupEndDate = new Date(updateNotice.popupEndDate);
    }

    await this.noticeServiceOutPort.update(id, updateData);
  }

  async delete(id: number): Promise<void> {
    await this.noticeServiceOutPort.updateStatus(id, DataStatus.DELETED);
  }
}
