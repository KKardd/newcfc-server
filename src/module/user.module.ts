import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRepository } from '@/adapter/outbound/user.repository';
import { UserRole } from '@/domain/entity/user-role.entity';
import { User } from '@/domain/entity/user.entity';
import { RedisModule } from '@/module/infrastructure/redis.module';
import { UserServiceInPort } from '@/port/inbound/user-service.in-port';
import { UserServiceOutPort } from '@/port/outbound/user-service.out-port';
import { UserService } from '@/port/service/user.service';

const typeOrmFeatureModules = [
  ...(process.env.NODE_ENV === 'test'
    ? [TypeOrmModule.forFeature([User, UserRole])]
    : [TypeOrmModule.forFeature([User, UserRole], 'accountConnection')]),
];

@Module({
  imports: [...typeOrmFeatureModules, RedisModule],
  controllers: [],
  providers: [
    { provide: UserServiceInPort, useClass: UserService },
    { provide: UserServiceOutPort, useClass: UserRepository },
  ],
  exports: [UserServiceInPort, UserServiceOutPort],
})
export class UserModule {}
