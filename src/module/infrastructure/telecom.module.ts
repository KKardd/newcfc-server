import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { SafetyPhoneService } from '@/infrastructure/telecom/safety-phone.service';
import { SafetyPhoneServiceOutPort } from '@/port/outbound/safety-phone-service.out-port';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: SafetyPhoneServiceOutPort,
      useClass: SafetyPhoneService,
    },
  ],
  exports: [SafetyPhoneServiceOutPort],
})
export class TelecomModule {}
