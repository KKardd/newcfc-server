import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { AdminLoginDto, ChauffeurLoginDto } from '@/adapter/inbound/dto/request/login.dto';
import { ResponseTokenDto } from '@/adapter/inbound/dto/response/response-token.dto';
import { Admin } from '@/domain/entity/admin.entity';
import { Chauffeur } from '@/domain/entity/chauffeur.entity';
import { TokenProvider } from '@/security/jwt/token.provider';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Chauffeur)
    private readonly chauffeurRepository: Repository<Chauffeur>,
    private readonly tokenProvider: TokenProvider,
  ) {}

  async adminLogin(loginDto: AdminLoginDto): Promise<ResponseTokenDto> {
    const admin = await this.adminRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!admin) {
      throw new UnauthorizedException('잘못된 로그인 정보입니다.');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('잘못된 로그인 정보입니다.');
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
}
