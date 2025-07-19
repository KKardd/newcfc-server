import { forwardRef, Module } from '@nestjs/common';

import { FCMService } from '@/infrastructure/notification/fcm.service';
import { NotificationService } from '@/port/service/notification.service';
import { NotificationServiceOutPort } from '@/port/outbound/notification-service.out-port';
import { ChauffeurModule } from '@/module/chauffeur.module';
import { OperationModule } from '@/module/operation.module';

@Module({
  imports: [forwardRef(() => ChauffeurModule), forwardRef(() => OperationModule)],
  providers: [
    FCMService,
    {
      provide: NotificationServiceOutPort,
      useClass: NotificationService,
    },
  ],
  exports: [NotificationServiceOutPort, FCMService],
})
export class NotificationModule {}
