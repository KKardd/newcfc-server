import { InjectRepository } from '@nestjs/typeorm';

import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchVendor } from '@/adapter/inbound/dto/request/vendor/search-vendor';
import { Vendor } from '@/domain/entity/vendor.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { VendorServiceOutPort } from '@/port/outbound/vendor-service.out-port';

export class VendorRepository implements VendorServiceOutPort {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
  ) {}

  async insert(newVendor: Vendor): Promise<Vendor> {
    return await this.vendorRepository.save(newVendor);
  }

  async update(vendorId: number, modifyVendor: Vendor): Promise<void> {
    await this.vendorRepository.update(vendorId, modifyVendor);
  }

  async checkDuplicatedVendor(tenantId: number, businessRegistrationNumber: string): Promise<boolean> {
    const queryOptions: FindOneOptions<Vendor> = {
      where: { tenantId: tenantId, businessRegistrationNumber: businessRegistrationNumber },
    };

    return await this.vendorRepository.exists(queryOptions);
  }

  async getAll(searchVendor: SearchVendor, paginationQuery: PaginationQuery): Promise<[Vendor[], number]> {
    const queryOptions: FindManyOptions<Vendor> = {
      order: { id: 'DESC' },
      skip: paginationQuery.skip,
      take: paginationQuery.countPerPage,
      where: {},
    };

    const { id, tenantId, manageCode, siteId, supplyChain, status } = searchVendor;

    if (id) {
      queryOptions.where = { ...queryOptions.where, id: id };
    }
    if (tenantId) {
      queryOptions.where = { ...queryOptions.where, tenantId: tenantId };
    }
    if (siteId) {
      queryOptions.where = { ...queryOptions.where, siteId: siteId };
    }
    if (manageCode) {
      queryOptions.where = { ...queryOptions.where, manageCode: manageCode };
    }
    if (supplyChain) {
      queryOptions.where = { ...queryOptions.where, supplyChain: supplyChain };
    }
    if (status) {
      queryOptions.where = { ...queryOptions.where, status: status };
    }

    const [vendors, totalCount] = await this.vendorRepository.findAndCount(queryOptions);
    return [vendors, totalCount];
  }

  async getById(vendorId: number, tenantId?: number, dataStatus?: DataStatus): Promise<Vendor | null> {
    const queryOptions: FindOneOptions<Vendor> = {
      where: { id: vendorId },
    };

    if (tenantId) {
      queryOptions.where = { ...queryOptions.where, tenantId: tenantId };
    }

    if (dataStatus) {
      queryOptions.where = { ...queryOptions.where, status: dataStatus };
    }

    return await this.vendorRepository.findOne(queryOptions);
  }
}
