import { Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Tenant } from '@/domain/entity/tenant.entity';
import { TenantLifecycle } from '@/domain/enum/tenant-life-cycle.enum';
import { TenantServiceOutPort } from '@/port/outbound/tenant-service.out-port';

export class TenantRepository implements TenantServiceOutPort {
  private tenantRepository: Repository<Tenant>;
  constructor(
    @Optional() @InjectRepository(Tenant) testTenantRepository: Repository<Tenant>,
    @Optional() @InjectRepository(Tenant, 'accountConnection') accountTenantRepository: Repository<Tenant>,
  ) {
    this.tenantRepository = process.env.NODE_ENV === 'test' ? testTenantRepository : accountTenantRepository;
  }

  async getStatusById(tenantId: number, tenantLifecycle: TenantLifecycle): Promise<Tenant | null> {
    return await this.tenantRepository.findOneBy({ id: tenantId, status: tenantLifecycle });
  }
}
