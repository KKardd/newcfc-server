import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FaqController } from '@/adapter/inbound/controller/faq.controller';
import { FaqRepository } from '@/adapter/outbound/faq.repository';
import { AdminRepository } from '@/adapter/outbound/admin.repository';
import { Faq } from '@/domain/entity/faq.entity';
import { Admin } from '@/domain/entity/admin.entity';
import { FaqServiceInPort } from '@/port/inbound/faq-service.in-port';
import { FaqServiceOutPort } from '@/port/outbound/faq-service.out-port';
import { AdminServiceOutPort } from '@/port/outbound/admin-service.out-port';
import { FaqService } from '@/port/service/faq.service';

@Module({
  imports: [TypeOrmModule.forFeature([Faq, Admin])],
  controllers: [FaqController],
  providers: [
    {
      provide: FaqServiceInPort,
      useClass: FaqService,
    },
    {
      provide: FaqServiceOutPort,
      useClass: FaqRepository,
    },
    {
      provide: AdminServiceOutPort,
      useClass: AdminRepository,
    },
  ],
  exports: [FaqServiceInPort, FaqServiceOutPort],
})
export class FaqModule {}
