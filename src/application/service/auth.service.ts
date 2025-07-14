import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { AdminLoginDto, ChauffeurLoginDto } from '@/adapter/inbound/dto/request/login.dto';
import { RefreshTokenDto } from '@/adapter/inbound/dto/request/refresh-token.dto';
import { ResponseTokenDto } from '@/adapter/inbound/dto/response/response-token.dto';
import { Admin } from '@/domain/entity/admin.entity';
import { Chauffeur } from '@/domain/entity/chauffeur.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { TokenProvider } from '@/security/jwt/token.provider';
import { RefreshTokenService } from '@/infrastructure/refresh-token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Chauffeur)
    private readonly chauffeurRepository: Repository<Chauffeur>,
    private readonly tokenProvider: TokenProvider,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async adminLogin(loginDto: AdminLoginDto): Promise<ResponseTokenDto> {
    const admin = await this.adminRepository.findOne({
      where: { email: loginDto.email, status: DataStatus.REGISTER },
    });

    if (!admin) {
      throw new UnauthorizedException('잘못된 로그인 정보입니다.');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('잘못된 로그인 정보입니다.');
    }

    if (!admin.approved) {
      throw new UnauthorizedException('관리자 승인이 필요합니다. 관리자에게 문의하세요.');
    }

    return this.tokenProvider.createToken(admin);
  }

  async chauffeurLogin(loginDto: ChauffeurLoginDto): Promise<ResponseTokenDto> {
    const chauffeur = await this.chauffeurRepository.findOne({
      where: { phone: loginDto.phone, birthDate: loginDto.birthDate },
    });

    if (!chauffeur) {
      throw new UnauthorizedException('잘못된 로그인 정보입니다.');
    }

    return this.tokenProvider.createToken(chauffeur);
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<ResponseTokenDto> {
    try {
      // 1. Refresh Token 검증
      const tokenPayload = await this.tokenProvider.verifyRefreshToken(refreshTokenDto.refreshToken);

      // 2. 데이터베이스에서 토큰 유효성 확인
      const storedToken = await this.refreshTokenService.validateToken(refreshTokenDto.refreshToken);
      if (!storedToken) {
        throw new UnauthorizedException('유효하지 않은 Refresh Token입니다.');
      }

      // 3. 사용자 정보 조회 (Admin 또는 Chauffeur)
      const userId = parseInt(tokenPayload.payload.userId.toString());
      let user: Admin | Chauffeur | null = null;

      // Admin 먼저 찾기
      user = await this.adminRepository.findOne({
        where: { id: userId, status: DataStatus.REGISTER },
      });

      // Admin이 없으면 Chauffeur 찾기
      if (!user) {
        user = await this.chauffeurRepository.findOne({
          where: { id: userId, status: DataStatus.REGISTER },
        });
      }

      if (!user) {
        throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
      }

      // 4. 기존 Refresh Token 삭제
      await this.refreshTokenService.deleteTokenByValue(refreshTokenDto.refreshToken);

      // 5. 새로운 토큰 발급
      return this.tokenProvider.createToken(user);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('토큰 재발급에 실패했습니다.');
    }
  }
}
