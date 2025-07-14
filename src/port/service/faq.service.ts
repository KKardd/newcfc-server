import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { Pagination, PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateFaqDto } from '@/adapter/inbound/dto/request/faq/create-faq.dto';
import { UpdateFaqDto } from '@/adapter/inbound/dto/request/faq/update-faq.dto';
import { FaqResponseDto } from '@/adapter/inbound/dto/response/faq/faq-response.dto';
import { Faq } from '@/domain/entity/faq.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { FaqServiceInPort } from '@/port/inbound/faq-service.in-port';
import { FaqServiceOutPort } from '@/port/outbound/faq-service.out-port';
import { AdminServiceOutPort } from '@/port/outbound/admin-service.out-port';
import { classTransformDefaultOptions } from '@/validate/serialization';

@Injectable()
export class FaqService implements FaqServiceInPort {
  constructor(
    private readonly faqServiceOutPort: FaqServiceOutPort,
    private readonly adminServiceOutPort: AdminServiceOutPort,
  ) {}

  async search(paginationQuery: PaginationQuery): Promise<PaginationResponse<FaqResponseDto>> {
    // 삭제 제외 조회
    const [faqs, totalCount] = await this.faqServiceOutPort.findAll(paginationQuery, DataStatus.DELETED);
    const pagination = new Pagination({ totalCount, paginationQuery });

    // 각 FAQ에 대해 관리자 이름 조회
    const response = await Promise.all(
      faqs.map(async (faq) => {
        const faqDto = plainToInstance(FaqResponseDto, faq, classTransformDefaultOptions);

        // 관리자 이름 조회
        try {
          const admin = await this.adminServiceOutPort.findById(faq.createdBy);
          faqDto.createdBy = admin?.name || '알 수 없음';
        } catch (error) {
          faqDto.createdBy = '알 수 없음';
        }

        return faqDto;
      }),
    );

    return new PaginationResponse(response, pagination);
  }

  async detail(id: number): Promise<FaqResponseDto> {
    const faq = await this.faqServiceOutPort.findById(id);
    if (!faq) throw new Error('FAQ를 찾을 수 없습니다.');

    const faqDto = plainToInstance(FaqResponseDto, faq, classTransformDefaultOptions);

    // 관리자 이름 조회
    try {
      const admin = await this.adminServiceOutPort.findById(faq.createdBy);
      faqDto.createdBy = admin?.name || '알 수 없음';
    } catch (error) {
      faqDto.createdBy = '알 수 없음';
    }

    return faqDto;
  }

  async create(createFaqDto: CreateFaqDto): Promise<void> {
    const faq = new Faq();
    faq.question = createFaqDto.title;
    faq.answer = createFaqDto.content;
    await this.faqServiceOutPort.save(faq);
  }

  async update(id: number, updateFaqDto: UpdateFaqDto): Promise<void> {
    const updateData: Partial<Faq> = {};

    if (updateFaqDto.title !== undefined) {
      updateData.question = updateFaqDto.title;
    }

    if (updateFaqDto.content !== undefined) {
      updateData.answer = updateFaqDto.content;
    }

    await this.faqServiceOutPort.update(id, updateData);
  }

  async delete(id: number): Promise<void> {
    await this.faqServiceOutPort.delete(id);
  }
}
