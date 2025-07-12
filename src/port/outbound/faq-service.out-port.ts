import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { Faq } from '@/domain/entity/faq.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

export abstract class FaqServiceOutPort {
  abstract findAll(paginationQuery: PaginationQuery, status?: string): Promise<[Faq[], number]>;

  abstract findById(id: number): Promise<Faq | null>;

  abstract save(faq: Faq): Promise<void>;

  abstract update(id: number, faq: Partial<Faq>): Promise<UpdateResult>;

  abstract delete(id: number): Promise<DeleteResult>;
}
