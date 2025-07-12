import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BaseEntity } from '@/domain/entity/base.entity';

export class CustomRepository<T extends BaseEntity> extends Repository<T> {
  async findOneOrFail(options?: any): Promise<T> {
    const entity = await super.findOne(options);
    if (!entity) {
      throw new NotFoundException('데이터가 존재하지 않습니다.');
    }
    return entity;
  }

  async find(options?: any): Promise<T[]> {
    return super.find(options);
  }

  async findAndCount(options?: any): Promise<[T[], number]> {
    return super.findAndCount(options);
  }
}
