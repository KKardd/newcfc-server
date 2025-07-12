import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { Faq } from '@/domain/entity/faq.entity';
import { FaqServiceOutPort } from '@/port/outbound/faq-service.out-port';
import { CustomRepository } from '@/util/custom-repository.decorator';
import { CustomRepository as BaseRepository } from './custom.repository';

@CustomRepository(Faq)
export class FaqRepository extends BaseRepository<Faq> implements FaqServiceOutPort {
  async findAll(paginationQuery: PaginationQuery): Promise<[Faq[], number]> {
    return this.findAndCount({
      skip: paginationQuery.skip,
      take: paginationQuery.countPerPage,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findById(id: number): Promise<Faq> {
    return this.findOneOrFail({ where: { id } });
  }
}
