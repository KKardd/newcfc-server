import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { SafetyPhoneServiceOutPort } from '@/port/outbound/safety-phone-service.out-port';

@Injectable()
export class SafetyPhoneService implements SafetyPhoneServiceOutPort {
  private readonly baseUrl = process.env.SAFETY_PHONE_BASE_URL || '';
  private readonly interfaceId = process.env.SAFETY_PHONE_INTERFACE_ID || '';

  constructor(private readonly httpService: HttpService) {}

  async createVirtualNumberWithAutoExpiry(realNumber: string, expireHours: number): Promise<string> {
    const formData = new URLSearchParams();
    formData.append('iid', this.interfaceId);
    formData.append('rn', realNumber);
    formData.append('expire_hour', expireHours.toString());
    formData.append('auth', this.generateAuth(this.interfaceId + realNumber));

    const response = await firstValueFrom(
      this.httpService.post('/link/auto_expire_mapp.do', formData, {
        baseURL: this.baseUrl,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
    );

    if (response.data.rt != 0) {
      throw new Error(response.data.rs);
    }

    return response.data.vn;
  }

  private generateAuth(data: string): string {
    return data;
  }
}
