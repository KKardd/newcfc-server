import { Tenant } from '@/domain/entity/tenant.entity';
import { TenantLifecycle } from '@/domain/enum/tenant-life-cycle.enum';

export abstract class TenantServiceOutPort {
  abstract getStatusById(tenantId: number, tenantLifecycle: TenantLifecycle): Promise<Tenant | null>;
}
