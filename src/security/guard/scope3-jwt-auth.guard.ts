import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { ContractStatus } from '@/domain/enum/contract-status.enum';
import { CustomException } from '@/exception/custom.exception';
import { ErrorCode } from '@/exception/error-code.enum';
import { ContractLicenseServiceOutPort } from '@/port/outbound/contract-service.out-port';
import { UserAccessTokenPayload } from '@/security/jwt/token.payload';

@Injectable()
export class Scope3Guard implements CanActivate {
  constructor(private readonly contractServiceOutPort: ContractLicenseServiceOutPort) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request & { user: { payload: UserAccessTokenPayload } } = context.switchToHttp().getRequest();
    if (!request.user) {
      throw new CustomException(ErrorCode.INVALID_TOKEN);
    }

    const tenantId = request.user.payload.tenantId;

    const contract = await this.contractServiceOutPort.contractLicenseFindByTenantId(tenantId, ContractStatus.ACTIVE);
    if (!contract || contract.scope3 === false) {
      throw new CustomException(ErrorCode.FORBIDDEN_LICENSE);
    }

    return true;
  }
}
