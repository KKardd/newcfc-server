import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { ChangeChauffeurStatusDto } from '@/adapter/inbound/dto/request/chauffeur/change-status.dto';
import { CreateChauffeurDto } from '@/adapter/inbound/dto/request/chauffeur/create-chauffeur.dto';
import { SearchChauffeurDto } from '@/adapter/inbound/dto/request/chauffeur/search-chauffeur.dto';
import { UpdateChauffeurDto } from '@/adapter/inbound/dto/request/chauffeur/update-chauffeur.dto';
import { UpdateLocationDto } from '@/adapter/inbound/dto/request/chauffeur/update-location.dto';
import { AssignedVehicleResponseDto } from '@/adapter/inbound/dto/response/chauffeur/assigned-vehicle-response.dto';
import { ChauffeurProfileResponseDto } from '@/adapter/inbound/dto/response/chauffeur/chauffeur-profile-response.dto';
import { ChauffeurResponseDto } from '@/adapter/inbound/dto/response/chauffeur/chauffeur-response.dto';
import { ChauffeurStatusChangeResponseDto } from '@/adapter/inbound/dto/response/chauffeur/status-change-response.dto';
import { CurrentOperationResponseDto } from '@/adapter/inbound/dto/response/chauffeur/current-operation-response.dto';
import { LocationResponseDto } from '@/adapter/inbound/dto/response/chauffeur/location-response.dto';
import { NearestReservationResponseDto } from '@/adapter/inbound/dto/response/chauffeur/nearest-reservation-response.dto';
import { ApiSuccessResponse } from '@/adapter/inbound/dto/swagger.decorator';
import { UserRoleType } from '@/domain/enum/user-role.enum';
import { ChauffeurServiceInPort } from '@/port/inbound/chauffeur-service.in-port';
import { JwtAuthGuard } from '@/security/guard/jwt-auth.guard';
import { Roles } from '@/security/guard/user-role.decorator';
import { UserRolesGuard } from '@/security/guard/user-role.guard';
import { UserToken } from '@/security/jwt/user-token.decorator';
import { UserAccessTokenPayload } from '@/security/jwt/token.payload';

class UpdateFCMTokenDto {
  @ApiProperty({ description: 'FCM 토큰', example: 'c1234567890abcdef...' })
  @IsString()
  @IsNotEmpty()
  fcmToken: string;
}

@ApiTags('Chauffeur')
@ApiBearerAuth()
@Controller('chauffeurs')
@UseGuards(JwtAuthGuard, UserRolesGuard)
@Roles(UserRoleType.CHAUFFEUR)
export class ChauffeurController {
  constructor(private readonly chauffeurService: ChauffeurServiceInPort) {}

  @ApiOperation({ summary: '기사 목록 조회' })
  @ApiSuccessResponse(200, PaginationResponse, { paginated: true })
  @Get()
  async search(
    @Query() searchChauffeur: SearchChauffeurDto,
    @Query() paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<ChauffeurResponseDto>> {
    return await this.chauffeurService.search(searchChauffeur, paginationQuery);
  }

  @ApiOperation({ summary: '기사 상세 조회' })
  @ApiSuccessResponse(200, ChauffeurResponseDto)
  @Get(':id')
  async detail(@Param('id', ParseIntPipe) id: number): Promise<ChauffeurResponseDto> {
    return await this.chauffeurService.detail(id);
  }

  @ApiOperation({ summary: '기사 생성' })
  @Post()
  async create(@Body() createChauffeur: CreateChauffeurDto): Promise<void> {
    await this.chauffeurService.create(createChauffeur);
  }

  @ApiOperation({ summary: '기사 정보 수정' })
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateChauffeur: UpdateChauffeurDto): Promise<void> {
    await this.chauffeurService.update(id, updateChauffeur);
  }

  @ApiOperation({ summary: '기사 삭제' })
  @Put(':id/delete')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.chauffeurService.delete(id);
  }

  @ApiOperation({ summary: '기사 상태 변경' })
  @ApiSuccessResponse(200, ChauffeurStatusChangeResponseDto)
  @Put(':id/status')
  async changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeStatusDto: ChangeChauffeurStatusDto,
  ): Promise<ChauffeurStatusChangeResponseDto> {
    return await this.chauffeurService.changeStatus(id, changeStatusDto);
  }

  // 기사 전용 API들
  @ApiOperation({ summary: '내 프로필 조회' })
  @ApiSuccessResponse(200, ChauffeurProfileResponseDto)
  @Roles(UserRoleType.CHAUFFEUR)
  @Get('me/profile')
  async getMyProfile(@UserToken() user: UserAccessTokenPayload): Promise<ChauffeurProfileResponseDto> {
    return await this.chauffeurService.getMyProfile(user.userId);
  }

  @ApiOperation({ summary: '내 배정 차량 조회' })
  @ApiSuccessResponse(200, AssignedVehicleResponseDto)
  @Roles(UserRoleType.CHAUFFEUR)
  @Get('me/vehicle')
  async getMyAssignedVehicle(@UserToken() user: UserAccessTokenPayload): Promise<AssignedVehicleResponseDto | null> {
    return await this.chauffeurService.getMyAssignedVehicle(user.userId);
  }

  @ApiOperation({ summary: '내 현재 운행/예약 조회' })
  @ApiSuccessResponse(200, CurrentOperationResponseDto)
  @Roles(UserRoleType.CHAUFFEUR)
  @Get('me/current-operation')
  async getMyCurrentOperation(@UserToken() user: UserAccessTokenPayload): Promise<CurrentOperationResponseDto | null> {
    return await this.chauffeurService.getMyCurrentOperation(user.userId);
  }

  @ApiOperation({ summary: '내 가장 가까운 예약 조회' })
  @ApiSuccessResponse(200, NearestReservationResponseDto)
  @Roles(UserRoleType.CHAUFFEUR)
  @Get('me/nearest-reservation')
  async getMyNearestReservation(@UserToken() user: UserAccessTokenPayload): Promise<NearestReservationResponseDto | null> {
    return await this.chauffeurService.getMyNearestReservation(user.userId);
  }

  // 위치 관련 API들
  @ApiOperation({ summary: '내 현재 위치 전송' })
  @Roles(UserRoleType.CHAUFFEUR)
  @Patch('me/location')
  async updateMyLocation(@UserToken() user: UserAccessTokenPayload, @Body() updateLocationDto: UpdateLocationDto): Promise<void> {
    await this.chauffeurService.updateMyLocation(user.userId, updateLocationDto);
  }

  @ApiOperation({ summary: '기사 현재 위치 조회' })
  @ApiSuccessResponse(200, LocationResponseDto)
  @Roles(UserRoleType.CHAUFFEUR)
  @Get(':chauffeurId/location')
  async getMyLocation(@Param('chauffeurId', ParseIntPipe) chauffeurId: number): Promise<LocationResponseDto> {
    return await this.chauffeurService.getMyLocation(chauffeurId);
  }

  // FCM 토큰 관리 API
  @ApiOperation({
    summary: 'FCM 토큰 등록/업데이트',
    description: '푸시 알림을 받기 위한 FCM 토큰을 등록하거나 업데이트합니다.',
  })
  @Roles(UserRoleType.CHAUFFEUR)
  @Put('me/fcm-token')
  async updateMyFCMToken(@UserToken() user: UserAccessTokenPayload, @Body() updateFCMTokenDto: UpdateFCMTokenDto): Promise<void> {
    await this.chauffeurService.updateFCMToken(user.userId, updateFCMTokenDto.fcmToken);
  }
}
