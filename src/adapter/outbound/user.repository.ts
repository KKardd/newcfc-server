import { Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from '@/domain/entity/user.entity';
import { UserLifecycle } from '@/domain/enum/user-life-cycle.enum';
import { UserServiceOutPort } from '@/port/outbound/user-service.out-port';

export class UserRepository implements UserServiceOutPort {
  private userRepository: Repository<User>;
  constructor(
    @Optional() @InjectRepository(User) testUserRepository: Repository<User>,
    @Optional() @InjectRepository(User, 'accountConnection') accountUserRepository: Repository<User>,
  ) {
    this.userRepository = process.env.NODE_ENV === 'test' ? testUserRepository : accountUserRepository;
  }

  async getStatusById(userId: number, tenantId: number, userLifecycle: UserLifecycle): Promise<User | null> {
    return await this.userRepository.findOneBy({ id: userId, tenantId: tenantId, status: userLifecycle });
  }
}
