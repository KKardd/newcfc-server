import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchNoticeDto } from '@/adapter/inbound/dto/request/notice/search-notice.dto';
import { NoticeResponseDto } from '@/adapter/inbound/dto/response/notice/notice-response.dto';
import { Notice } from '@/domain/entity/notice.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { NoticeServiceOutPort } from '@/port/outbound/notice-service.out-port';

@Injectable()
export class NoticeRepository implements NoticeServiceOutPort {
  constructor(
    @InjectRepository(Notice)
    private readonly repository: Repository<Notice>,
  ) {}

  async findAll(searchNotice: SearchNoticeDto, paginationQuery: PaginationQuery): Promise<[NoticeResponseDto[], number]> {
    const queryBuilder = this.repository.createQueryBuilder('notice').select('notice.*');

    if (searchNotice.title) {
      queryBuilder.andWhere('notice.title LIKE :title', {
        title: `%${searchNotice.title}%`,
      });
    }

    if (searchNotice.content) {
      queryBuilder.andWhere('notice.content LIKE :content', {
        content: `%${searchNotice.content}%`,
      });
    }

    if (searchNotice.status) {
      queryBuilder.andWhere('notice.status = :status', {
        status: searchNotice.status,
      });
    }

    if (searchNotice.isPopup !== undefined) {
      queryBuilder.andWhere('notice.is_popup = :isPopup', {
        isPopup: searchNotice.isPopup,
      });
    }

    queryBuilder.orderBy('notice.id', 'DESC').offset(paginationQuery.skip).limit(paginationQuery.countPerPage);

    const notices = await queryBuilder.getRawMany();
    const totalCount = await queryBuilder.getCount();

    const noticesResponse: NoticeResponseDto[] = notices.map((notice) => ({
      id: notice.id,
      title: notice.title,
      content: notice.content,
      status: notice.status,
      isPopup: notice.is_popup,
      popupStartDate: notice.popup_start_date,
      popupEndDate: notice.popup_end_date,
      createdAt: notice.created_at,
      updatedAt: notice.updated_at,
    }));

    return [noticesResponse, totalCount];
  }

  async findPopupNotices(): Promise<NoticeResponseDto[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('notice')
      .select('notice.*')
      .where('notice.is_popup = :isPopup', { isPopup: true })
      .andWhere('notice.status = :status', { status: DataStatus.REGISTER })
      .andWhere('(notice.popup_start_date IS NULL OR notice.popup_start_date <= NOW())')
      .andWhere('(notice.popup_end_date IS NULL OR notice.popup_end_date >= NOW())')
      .orderBy('notice.id', 'DESC');

    const notices = await queryBuilder.getRawMany();

    return notices.map((notice) => ({
      id: notice.id,
      title: notice.title,
      content: notice.content,
      status: notice.status,
      isPopup: notice.is_popup,
      popupStartDate: notice.popup_start_date,
      popupEndDate: notice.popup_end_date,
      createdAt: notice.created_at,
      updatedAt: notice.updated_at,
    }));
  }

  async findById(id: number): Promise<Notice | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async save(notice: Notice): Promise<void> {
    await this.repository.save(notice);
  }

  async update(id: number, notice: Partial<Notice>): Promise<void> {
    await this.repository.update(id, notice);
  }

  async updateStatus(id: number, status: DataStatus): Promise<void> {
    await this.repository.update(id, { status });
  }
}
