import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { Pagination, PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateFaqDto } from '@/adapter/inbound/dto/request/faq/create-faq.dto';
import { UpdateFaqDto } from '@/adapter/inbound/dto/request/faq/update-faq.dto';
import { FaqResponseDto } from '@/adapter/inbound/dto/response/faq/faq-response.dto';
import { Faq } from '@/domain/entity/faq.entity';
import { FaqServiceInPort } from '@/port/inbound/faq-service.in-port';
import { FaqServiceOutPort } from '@/port/outbound/faq-service.out-port';
import { classTransformDefaultOptions } from '@/validate/serialization';

@Injectable()
export class FaqService implements FaqServiceInPort {
  constructor(private readonly faqServiceOutPort: FaqServiceOutPort) {}

  async search(paginationQuery: PaginationQuery): Promise<PaginationResponse<FaqResponseDto>> {
    const [faqs, totalCount] = await this.faqServiceOutPort.findAll(paginationQuery);
    const pagination = new Pagination({ totalCount, paginationQuery });

    const response = plainToInstance(FaqResponseDto, faqs, classTransformDefaultOptions);

    return new PaginationResponse(response, pagination);
  }

  async detail(id: number): Promise<FaqResponseDto> {
    const faq = await this.faqServiceOutPort.findById(id);
    return plainToInstance(FaqResponseDto, faq, classTransformDefaultOptions);
  }

  async create(createFaqDto: CreateFaqDto): Promise<void> {
    const faq = plainToInstance(Faq, {
      ...createFaqDto,
      createdBy: null,
    });
    await this.faqServiceOutPort.save(faq);
  }

  async update(id: number, updateFaqDto: UpdateFaqDto): Promise<void> {
    await this.faqServiceOutPort.update(id, updateFaqDto as Partial<Faq>);
  }

  async delete(id: number): Promise<void> {
    await this.faqServiceOutPort.delete(id);
  }
}
