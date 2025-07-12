import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchNoticeDto } from '@/adapter/inbound/dto/request/notice/search-notice.dto';
import { Notice } from '@/domain/entity/notice.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { NoticeServiceOutPort } from '@/port/outbound/notice-service.out-port';
import { CustomRepository } from '@/util/custom-repository.decorator';
import { CustomRepository as BaseRepository } from './custom.repository';

@CustomRepository(Notice)
export class NoticeRepository extends BaseRepository<Notice> implements NoticeServiceOutPort {
  async findAll(search: SearchNoticeDto, paginationQuery: PaginationQuery): Promise<[Notice[], number]> {
    const queryBuilder = this.createQueryBuilder('notice');

    if (search.title) {
      queryBuilder.andWhere('notice.title LIKE :title', {
        title: `%${search.title}%`,
      });
    }

    if (search.status) {
      queryBuilder.andWhere('notice.status = :status', {
        status: search.status,
      });
    }

    if (search.startDate) {
      queryBuilder.andWhere('notice.createdAt >= :startDate', {
        startDate: search.startDate,
      });
    }

    if (search.endDate) {
      queryBuilder.andWhere('notice.createdAt <= :endDate', {
        endDate: search.endDate,
      });
    }

    queryBuilder.orderBy('notice.createdAt', 'DESC').skip(paginationQuery.skip).take(paginationQuery.countPerPage);

    return queryBuilder.getManyAndCount();
  }

  async findPopupNotices(): Promise<Notice[]> {
    return this.find({
      where: {
        isPopup: true,
        status: DataStatus.REGISTER,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findByNoticeId(id: number): Promise<Notice> {
    return this.findOneOrFail({ where: { id } });
  }

  async updateStatus(id: number, status: DataStatus) {
    return this.update(id, { status });
  }
}
