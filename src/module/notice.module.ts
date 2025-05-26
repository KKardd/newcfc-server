import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NoticeController } from '@/adapter/inbound/controller/notice.controller';
import { NoticeRepository } from '@/adapter/outbound/notice.repository';
import { Notice } from '@/domain/entity/notice.entity';
import { NoticeServiceInPort } from '@/port/inbound/notice-service.in-port';
import { NoticeServiceOutPort } from '@/port/outbound/notice-service.out-port';
import { NoticeService } from '@/port/service/notice.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notice])],
  controllers: [NoticeController],
  providers: [
    {
      provide: NoticeServiceInPort,
      useClass: NoticeService,
    },
    {
      provide: NoticeServiceOutPort,
      useClass: NoticeRepository,
    },
  ],
  exports: [NoticeServiceInPort, NoticeServiceOutPort],
})
export class NoticeModule {}
