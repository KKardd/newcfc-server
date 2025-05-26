import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './entity/refresh-token.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async saveToken(userId: string, token: string, expiresAt: Date): Promise<void> {
    const refreshToken = this.refreshTokenRepository.create({
      userId,
      token,
      expiresAt,
    });
    await this.refreshTokenRepository.save(refreshToken);
  }

  async getToken(userId: string): Promise<string | null> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return refreshToken?.token ?? null;
  }

  async deleteToken(userId: string): Promise<void> {
    await this.refreshTokenRepository.delete({ userId });
  }
}
