import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationController } from '@/adapter/inbound/controller/notification.controller';
import { NotificationHistoryRepository } from '@/adapter/outbound/notification-history.repository';
import { Notification } from '@/domain/entity/notification.entity';
import { NotificationHistoryServiceInPort } from '@/port/inbound/notification-history-service.in-port';
import { NotificationHistoryServiceOutPort } from '@/port/outbound/notification-history-service.out-port';
import { NotificationHistoryService } from '@/port/service/notification-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  controllers: [NotificationController],
  providers: [
    {
      provide: NotificationHistoryServiceInPort,
      useClass: NotificationHistoryService,
    },
    {
      provide: NotificationHistoryServiceOutPort,
      useClass: NotificationHistoryRepository,
    },
  ],
  exports: [NotificationHistoryServiceOutPort],
})
export class NotificationHistoryModule {}
