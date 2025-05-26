import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchNoticeDto } from '@/adapter/inbound/dto/request/notice/search-notice.dto';
import { Notice } from '@/domain/entity/notice.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { NoticeServiceOutPort } from '@/port/outbound/notice-service.out-port';

@Injectable()
export class NoticeRepository implements NoticeServiceOutPort {
  constructor(
    @InjectRepository(Notice)
    private readonly repository: Repository<Notice>,
  ) {}

  async findAll(searchNotice: SearchNoticeDto, paginationQuery: PaginationQuery): Promise<[Notice[], number]> {
    const query = this.repository.createQueryBuilder('notice');

    if (searchNotice.title) {
      query.andWhere('notice.title LIKE :title', {
        title: `%${searchNotice.title}%`,
      });
    }

    if (searchNotice.content) {
      query.andWhere('notice.content LIKE :content', {
        content: `%${searchNotice.content}%`,
      });
    }

    if (searchNotice.status) {
      query.andWhere('notice.status = :status', {
        status: searchNotice.status,
      });
    }

    return await query.skip(paginationQuery.skip).take(paginationQuery.countPerPage).getManyAndCount();
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
