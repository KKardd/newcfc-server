import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkHistoryController } from '@/adapter/inbound/controller/work-history.controller';
import { WorkHistoryRepository } from '@/adapter/outbound/work-history.repository';
import { WorkHistory } from '@/domain/entity/work-history.entity';
import { Vehicle } from '@/domain/entity/vehicle.entity';
import { Chauffeur } from '@/domain/entity/chauffeur.entity';
import { WorkHistoryService } from '@/port/service/work-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkHistory, Vehicle, Chauffeur])],
  controllers: [WorkHistoryController],
  providers: [WorkHistoryService, WorkHistoryRepository],
  exports: [WorkHistoryService],
})
export class WorkHistoryModule {}
