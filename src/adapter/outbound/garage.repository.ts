import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchGarageDto } from '@/adapter/inbound/dto/request/garage/search-garage.dto';
import { Garage } from '@/domain/entity/garage.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { GarageServiceOutPort } from '@/port/outbound/garage-service.out-port';

@Injectable()
export class GarageRepository implements GarageServiceOutPort {
  constructor(
    @InjectRepository(Garage)
    private readonly repository: Repository<Garage>,
  ) {}

  async findAll(searchGarage: SearchGarageDto, paginationQuery: PaginationQuery): Promise<[Garage[], number]> {
    const query = this.repository.createQueryBuilder('garage');

    if (searchGarage.name) {
      query.andWhere('garage.name LIKE :name', {
        name: `%${searchGarage.name}%`,
      });
    }

    if (searchGarage.address) {
      query.andWhere('garage.address LIKE :address', {
        address: `%${searchGarage.address}%`,
      });
    }

    if (searchGarage.status) {
      query.andWhere('garage.status = :status', {
        status: searchGarage.status,
      });
    }

    return await query.skip(paginationQuery.skip).take(paginationQuery.countPerPage).getManyAndCount();
  }

  async findById(id: number): Promise<Garage> {
    return await this.repository.findOneOrFail({ where: { id } });
  }

  async save(garage: Garage): Promise<void> {
    await this.repository.save(garage);
  }

  async update(id: number, garage: Partial<Garage>): Promise<void> {
    await this.repository.update(id, garage);
  }

  async updateStatus(id: number, status: DataStatus): Promise<void> {
    await this.repository.update(id, { status });
  }
}
