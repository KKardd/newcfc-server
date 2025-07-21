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
import { AdminServiceOutPort } from '@/port/outbound/admin-service.out-port';
import { NoticeServiceOutPort } from '@/port/outbound/notice-service.out-port';
import {} from '@/validate/serialization';

@Injectable()
export class NoticeService implements NoticeServiceInPort {
  constructor(
    private readonly noticeServiceOutPort: NoticeServiceOutPort,
    private readonly adminServiceOutPort: AdminServiceOutPort,
  ) {}

  async search(searchNotice: SearchNoticeDto, paginationQuery: PaginationQuery): Promise<PaginationResponse<NoticeResponseDto>> {
    const [notices, totalCount] = await this.noticeServiceOutPort.findAll(searchNotice, paginationQuery, DataStatus.DELETED);
    const pagination = new Pagination({ totalCount, paginationQuery });

    // 각 Notice에 대해 관리자 이름 조회
    const response = await Promise.all(
      notices.map(async (notice) => {
        const noticeDto = plainToInstance(NoticeResponseDto, notice);

        // 관리자 이름 조회 (adminId 또는 createdBy 사용)
        try {
          const adminId = notice.adminId || notice.createdBy;
          const admin = await this.adminServiceOutPort.findById(adminId);
          noticeDto.createdBy = admin?.name || '알 수 없음';
        } catch (error) {
          noticeDto.createdBy = '알 수 없음';
        }

        return noticeDto;
      }),
    );

    return new PaginationResponse(response, pagination);
  }

  async getPopupNotices(): Promise<NoticeResponseDto[]> {
    const notices = await this.noticeServiceOutPort.findPopupNotices();

    // 각 Notice에 대해 관리자 이름 조회
    const response = await Promise.all(
      notices.map(async (notice) => {
        const noticeDto = plainToInstance(NoticeResponseDto, notice);

        // 관리자 이름 조회 (adminId 또는 createdBy 사용)
        try {
          const adminId = notice.adminId || notice.createdBy;
          const admin = await this.adminServiceOutPort.findById(adminId);
          noticeDto.createdBy = admin?.name || '알 수 없음';
        } catch (error) {
          noticeDto.createdBy = '알 수 없음';
        }

        return noticeDto;
      }),
    );

    return response;
  }

  async detail(id: number): Promise<NoticeResponseDto> {
    const notice = await this.noticeServiceOutPort.findByNoticeId(id);
    if (!notice) throw new Error('공지사항을 찾을 수 없습니다.');

    const noticeDto = plainToInstance(NoticeResponseDto, notice);

    // 관리자 이름 조회 (adminId 또는 createdBy 사용)
    try {
      const adminId = notice.adminId || notice.createdBy;
      const admin = await this.adminServiceOutPort.findById(adminId);
      noticeDto.createdBy = admin?.name || '알 수 없음';
    } catch (error) {
      noticeDto.createdBy = '알 수 없음';
    }

    return noticeDto;
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
