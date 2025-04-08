import { Contract } from '@/domain/entity/contract.entity';
import { ContractStatus } from '@/domain/enum/contract-status.enum';

export abstract class ContractLicenseServiceOutPort {
  abstract contractLicenseFindByTenantId(tenantId: number, status?: ContractStatus): Promise<Contract | null>;
}
