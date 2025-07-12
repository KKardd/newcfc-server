import { NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, In, Not, Repository } from 'typeorm';
import { QueryPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BaseEntity } from '@/domain/entity/base.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';

export class CustomRepository<T extends BaseEntity> extends Repository<T> {
  async findOneOrFail(options?: any): Promise<T> {
    const findOptions = this.getUndeletedOptions(options);
    const entity = await super.findOne(findOptions);

    if (!entity) {
      throw new NotFoundException('데이터가 존재하지 않습니다.');
    }

    return entity;
  }

  async find(options?: any): Promise<T[]> {
    const findOptions = this.getUndeletedOptions(options);
    return super.find(findOptions);
  }

  async findAndCount(options?: any): Promise<[T[], number]> {
    const findOptions = this.getUndeletedOptions(options);
    return super.findAndCount(findOptions);
  }

  private getUndeletedOptions(options?: any) {
    const where = options?.where || options;
    const findOptions = { ...options };
    findOptions.where = { ...where, status: Not(DataStatus.DELETED) };

    return findOptions;
  }
}
