import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Not } from 'typeorm';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchGarageDto } from '@/adapter/inbound/dto/request/garage/search-garage.dto';
import { Garage } from '@/domain/entity/garage.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { GarageServiceOutPort } from '@/port/outbound/garage-service.out-port';

@Injectable()
export class GarageRepository implements GarageServiceOutPort {
  constructor(
    @InjectRepository(Garage)
    private readonly garageRepository: Repository<Garage>,
  ) {}

  async findAll(search: SearchGarageDto, paginationQuery: PaginationQuery, status?: string): Promise<[Garage[], number]> {
    const where: any = {};
    if (search.name) where.name = Like(`%${search.name}%`);
    if (search.address) where.address = Like(`%${search.address}%`);
    if (status === DataStatus.DELETED) {
      where.status = Not(DataStatus.DELETED);
    } else if (status) {
      where.status = status;
    }
    return this.garageRepository.findAndCount({
      skip: paginationQuery.skip,
      take: paginationQuery.countPerPage,
      order: { createdAt: 'DESC' },
      where,
    });
  }

  async findById(id: number): Promise<Garage | null> {
    return this.garageRepository.findOne({ where: { id } });
  }

  async findByIdWithVehicleCount(id: number): Promise<Garage | null> {
    return this.garageRepository.findOne({ where: { id } });
  }

  async save(garage: Garage): Promise<Garage> {
    return this.garageRepository.save(garage);
  }

  async update(id: number, garage: Partial<Garage>) {
    return this.garageRepository.update(id, garage);
  }

  async updateStatus(id: number, status: DataStatus) {
    return this.garageRepository.update(id, { status });
  }
}
