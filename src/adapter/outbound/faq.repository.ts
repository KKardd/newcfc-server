import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { Faq } from '@/domain/entity/faq.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { FaqServiceOutPort } from '@/port/outbound/faq-service.out-port';

@Injectable()
export class FaqRepository implements FaqServiceOutPort {
  constructor(
    @InjectRepository(Faq)
    private readonly faqRepository: Repository<Faq>,
  ) {}

  async findAll(paginationQuery: PaginationQuery, status?: string): Promise<[Faq[], number]> {
    const where: any = {};
    if (status === 'delete') {
      where.status = Not(DataStatus.DELETED);
    } else if (status) {
      where.status = status;
    }
    return this.faqRepository.findAndCount({
      skip: paginationQuery.skip,
      take: paginationQuery.countPerPage,
      order: { createdAt: 'DESC' },
      where,
    });
  }

  async findById(id: number): Promise<Faq | null> {
    return this.faqRepository.findOne({ where: { id } });
  }

  async save(faq: Faq): Promise<void> {
    await this.faqRepository.save(faq);
  }

  async update(id: number, faq: Partial<Faq>) {
    return this.faqRepository.update(id, faq);
  }

  async delete(id: number) {
    return this.faqRepository.delete(id);
  }
}
