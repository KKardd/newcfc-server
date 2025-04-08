import { Injectable, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOneOptions, Repository } from 'typeorm';

import { Contract } from '@/domain/entity/contract.entity';
import { ContractStatus } from '@/domain/enum/contract-status.enum';
import { ContractLicenseServiceOutPort } from '@/port/outbound/contract-service.out-port';

@Injectable()
export class ContractLicenseRepository implements ContractLicenseServiceOutPort {
  private contractRepository: Repository<Contract>;
  constructor(
    @Optional() @InjectRepository(Contract) testContractRepository: Repository<Contract>,
    @Optional() @InjectRepository(Contract, 'accountConnection') accountContractRepository: Repository<Contract>,
  ) {
    this.contractRepository = process.env.NODE_ENV === 'test' ? testContractRepository : accountContractRepository;
  }

  async contractLicenseFindByTenantId(tenantId: number, status?: ContractStatus): Promise<Contract | null> {
    const queryOptions: FindOneOptions<Contract> = {
      where: {
        tenantId,
      },
    };

    if (status) {
      queryOptions.where = { ...queryOptions.where, status };
    }

    return await this.contractRepository.findOne(queryOptions);
  }
}
