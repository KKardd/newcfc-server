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
    const [notices, totalCount] = await this.noticeServiceOutPort.findAll(searchNotice, paginationQuery, DataStatus.DELETED);
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

    // isPopup이 false이면 팝업 날짜를 null로 설정
    if (notice.isPopup) {
      notice.popupStartDate = createNotice.popupStartDate ? new Date(createNotice.popupStartDate) : null;
      notice.popupEndDate = createNotice.popupEndDate ? new Date(createNotice.popupEndDate) : null;
    } else {
      notice.popupStartDate = null;
      notice.popupEndDate = null;
    }

    await this.noticeServiceOutPort.save(notice);
  }

  async update(id: number, updateNotice: UpdateNoticeDto): Promise<void> {
    const updateData: Partial<Notice> = {
      title: updateNotice.title,
      content: updateNotice.content,
      isPopup: updateNotice.isPopup,
    };

    // isPopup이 명시적으로 설정된 경우에만 팝업 날짜 처리
    if (updateNotice.isPopup !== undefined) {
      if (updateNotice.isPopup) {
        // 팝업이 활성화된 경우에만 날짜 설정
        if (updateNotice.popupStartDate) {
          updateData.popupStartDate = new Date(updateNotice.popupStartDate);
        }
        if (updateNotice.popupEndDate) {
          updateData.popupEndDate = new Date(updateNotice.popupEndDate);
        }
      } else {
        // 팝업이 비활성화된 경우 날짜를 null로 설정
        updateData.popupStartDate = null;
        updateData.popupEndDate = null;
      }
    } else {
      // isPopup이 설정되지 않은 경우에는 개별 날짜 필드만 업데이트
      if (updateNotice.popupStartDate) {
        updateData.popupStartDate = new Date(updateNotice.popupStartDate);
      }
      if (updateNotice.popupEndDate) {
        updateData.popupEndDate = new Date(updateNotice.popupEndDate);
      }
    }

    await this.noticeServiceOutPort.update(id, updateData);
  }

  async delete(id: number): Promise<void> {
    await this.noticeServiceOutPort.updateStatus(id, DataStatus.DELETED);
  }
}
