import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateFaqDto } from '@/adapter/inbound/dto/request/faq/create-faq.dto';
import { UpdateFaqDto } from '@/adapter/inbound/dto/request/faq/update-faq.dto';
import { FaqResponseDto } from '@/adapter/inbound/dto/response/faq/faq-response.dto';

export abstract class FaqServiceInPort {
  abstract search(paginationQuery: PaginationQuery): Promise<PaginationResponse<FaqResponseDto>>;
  abstract detail(id: number): Promise<FaqResponseDto>;
  abstract create(createFaqDto: CreateFaqDto): Promise<void>;
  abstract update(id: number, updateFaqDto: UpdateFaqDto): Promise<void>;
  abstract delete(id: number): Promise<void>;
}
