import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, MoreThanOrEqual, LessThanOrEqual, Not } from 'typeorm';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchNoticeDto } from '@/adapter/inbound/dto/request/notice/search-notice.dto';
import { Notice } from '@/domain/entity/notice.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { NoticeServiceOutPort } from '@/port/outbound/notice-service.out-port';

@Injectable()
export class NoticeRepository implements NoticeServiceOutPort {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
  ) {}

  async findAll(search: SearchNoticeDto, paginationQuery: PaginationQuery, status?: string): Promise<[Notice[], number]> {
    const where: any = {};
    if (search.title) where.title = Like(`%${search.title}%`);
    if (status === 'delete') {
      where.status = Not(DataStatus.DELETED);
    } else if (status) {
      where.status = status;
    }
    if (search.startDate) where.createdAt = MoreThanOrEqual(search.startDate);
    if (search.endDate) where.createdAt = LessThanOrEqual(search.endDate);
    return this.noticeRepository.findAndCount({
      skip: paginationQuery.skip,
      take: paginationQuery.countPerPage,
      order: { createdAt: 'DESC' },
      where,
    });
  }

  async findPopupNotices(): Promise<Notice[]> {
    return this.noticeRepository.find({
      where: {
        isPopup: true,
        status: DataStatus.REGISTER,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async findByNoticeId(id: number): Promise<Notice> {
    return this.noticeRepository.findOneOrFail({ where: { id } });
  }

  async save(notice: Notice): Promise<Notice> {
    return this.noticeRepository.save(notice);
  }

  async update(id: number, notice: Partial<Notice>) {
    return this.noticeRepository.update(id, notice);
  }

  async updateStatus(id: number, status: DataStatus) {
    return this.noticeRepository.update(id, { status });
  }
}
