import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { UserResponseDto } from '@/adapter/inbound/dto/response/user/user-response.dto';
import { UserLifecycle } from '@/domain/enum/user-life-cycle.enum';
import { CustomException } from '@/exception/custom.exception';
import { ErrorCode } from '@/exception/error-code.enum';
import { UserServiceInPort } from '@/port/inbound/user-service.in-port';
import { UserServiceOutPort } from '@/port/outbound/user-service.out-port';
import { classTransformDefaultOptions } from '@/validate/serialization';

@Injectable()
export class UserService implements UserServiceInPort {
  constructor(private readonly userServiceOutPort: UserServiceOutPort) {}

  async getById(userId: number, tenantId: number): Promise<UserResponseDto> {
    const currentUser = await this.userServiceOutPort.getStatusById(userId, tenantId, UserLifecycle.ACTIVE);
    if (currentUser === null) {
      throw new CustomException(ErrorCode.NOT_FOUND_USER);
    }

    return plainToInstance(UserResponseDto, currentUser, classTransformDefaultOptions);
  }
}
