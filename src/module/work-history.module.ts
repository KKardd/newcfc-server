import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkHistoryController } from '@/adapter/inbound/controller/work-history.controller';
import { WorkHistoryRepository } from '@/adapter/outbound/work-history.repository';
import { WorkHistory } from '@/domain/entity/work-history.entity';
import { WorkHistoryService } from '@/port/service/work-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkHistory])],
  controllers: [WorkHistoryController],
  providers: [WorkHistoryService, WorkHistoryRepository],
  exports: [WorkHistoryService],
})
export class WorkHistoryModule {}
