import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminController } from '@/adapter/inbound/controller/admin.controller';
import { AdminRepository } from '@/adapter/outbound/admin.repository';
import { Admin } from '@/domain/entity/admin.entity';
import { AdminServiceInPort } from '@/port/inbound/admin-service.in-port';
import { AdminServiceOutPort } from '@/port/outbound/admin-service.out-port';
import { AdminService } from '@/port/service/admin.service';
import { ChauffeurModule } from './chauffeur.module';
import { VehicleModule } from './vehicle.module';
import { OperationModule } from './operation.module';

@Module({
  imports: [TypeOrmModule.forFeature([Admin]), ChauffeurModule, VehicleModule, OperationModule],
  controllers: [AdminController],
  providers: [
    {
      provide: AdminServiceInPort,
      useClass: AdminService,
    },
    {
      provide: AdminServiceOutPort,
      useClass: AdminRepository,
    },
  ],
  exports: [AdminServiceInPort, AdminServiceOutPort],
})
export class AdminModule {}
