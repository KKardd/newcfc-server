import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OperationController } from '@/adapter/inbound/controller/operation.controller';
import { OperationRepository } from '@/adapter/outbound/operation.repository';
import { Operation } from '@/domain/entity/operation.entity';
import { WayPoint } from '@/domain/entity/way-point.entity';
import { OperationServiceInPort } from '@/port/inbound/operation-service.in-port';
import { OperationServiceOutPort } from '@/port/outbound/operation-service.out-port';
import { OperationService } from '@/port/service/operation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Operation, WayPoint])],
  controllers: [OperationController],
  providers: [
    {
      provide: OperationServiceInPort,
      useClass: OperationService,
    },
    {
      provide: OperationServiceOutPort,
      useClass: OperationRepository,
    },
  ],
  exports: [OperationServiceInPort, OperationServiceOutPort],
})
export class OperationModule {}
