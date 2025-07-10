import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { FaqResponseDto } from '@/adapter/inbound/dto/response/faq/faq-response.dto';
import { Faq } from '@/domain/entity/faq.entity';
import { FaqServiceOutPort } from '@/port/outbound/faq-service.out-port';
import { classTransformDefaultOptions } from '@/validate/serialization';

@Injectable()
export class FaqRepository implements FaqServiceOutPort {
  constructor(
    @InjectRepository(Faq)
    private readonly repository: Repository<Faq>,
  ) {}

  async findAll(paginationQuery: PaginationQuery): Promise<[FaqResponseDto[], number]> {
    const [faqs, totalCount] = await this.repository.findAndCount({
      order: { id: 'DESC' },
      skip: paginationQuery.skip,
      take: paginationQuery.countPerPage,
    });

    const faqResponses = faqs.map((faq) => plainToInstance(FaqResponseDto, faq, classTransformDefaultOptions));

    return [faqResponses, totalCount];
  }

  async findById(id: number): Promise<Faq> {
    return await this.repository.findOneOrFail({ where: { id } });
  }

  async save(faq: Faq): Promise<void> {
    await this.repository.save(faq);
  }

  async update(id: number, faq: Partial<Faq>): Promise<void> {
    await this.repository.update(id, faq);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
