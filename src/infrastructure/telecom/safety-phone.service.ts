import { createHash } from 'crypto';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

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
    formData.append('auth', this.generateAuthWithDebug(this.interfaceId + realNumber));

    const response = await firstValueFrom(
      this.httpService.post('/link/auto_expire_mapp.do', formData, {
        baseURL: this.baseUrl,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
    );
    console.log('-->', response.data);

    if (response.data.rt != 0) {
      throw new Error(response.data.rs);
    }

    return response.data.vn;
  }

  private generateAuth(data: string): string {
    const md5Hash = createHash('md5').update(data, 'utf8').digest();
    const base64Encoded = md5Hash.toString('base64');
    return base64Encoded;
  }

  private generateAuthWithDebug(data: string): string {
    console.log('Original data:', data);

    const md5HashHex = createHash('md5').update(data, 'utf8').digest('hex');
    console.log('MD5 hash (hex):', md5HashHex);

    const md5HashBinary = createHash('md5').update(data, 'utf8').digest();
    console.log('MD5 hash (binary length):', md5HashBinary.length);

    const base64Result = md5HashBinary.toString('base64');
    console.log('Base64 encoded:', base64Result);

    return base64Result;
  }
}
