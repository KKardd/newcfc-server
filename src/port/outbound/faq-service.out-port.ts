import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { FaqResponseDto } from '@/adapter/inbound/dto/response/faq/faq-response.dto';
import { Faq } from '@/domain/entity/faq.entity';

export abstract class FaqServiceOutPort {
  abstract findAll(paginationQuery: PaginationQuery): Promise<[FaqResponseDto[], number]>;
  abstract findById(id: number): Promise<Faq>;
  abstract save(faq: Faq): Promise<void>;
  abstract update(id: number, faq: Partial<Faq>): Promise<void>;
  abstract delete(id: number): Promise<void>;
}
