import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, MoreThan } from 'typeorm';

import { RefreshToken } from '../domain/entity/refresh-token.entity';

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

  async validateToken(token: string): Promise<RefreshToken | null> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: {
        token,
        expiresAt: MoreThan(new Date()),
      },
    });
    return refreshToken;
  }

  async deleteToken(userId: string): Promise<void> {
    await this.refreshTokenRepository.delete({ userId });
  }

  async deleteTokenByValue(token: string): Promise<void> {
    await this.refreshTokenRepository.delete({ token });
  }
}
