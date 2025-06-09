import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateReservationDto } from '@/adapter/inbound/dto/request/reservation/create-reservation.dto';
import { SearchReservationDto } from '@/adapter/inbound/dto/request/reservation/search-reservation.dto';
import { UpdateReservationDto } from '@/adapter/inbound/dto/request/reservation/update-reservation.dto';
import { ReservationResponseDto } from '@/adapter/inbound/dto/response/reservation/reservation-response.dto';
import { ApiSuccessResponse } from '@/adapter/inbound/dto/swagger.decorator';
import { UserRoleType } from '@/domain/enum/user-role.enum';
import { ReservationServiceInPort } from '@/port/inbound/reservation-service.in-port';
import { JwtAuthGuard } from '@/security/guard/jwt-auth.guard';
import { Roles } from '@/security/guard/user-role.decorator';
import { UserRolesGuard } from '@/security/guard/user-role.guard';

@ApiTags('Reservation')
@ApiBearerAuth()
@Controller('reservations')
@UseGuards(JwtAuthGuard, UserRolesGuard)
@Roles(UserRoleType.SUPER_ADMIN)
export class ReservationController {
  constructor(private readonly reservationService: ReservationServiceInPort) {}

  @ApiOperation({ summary: '예약 목록 조회' })
  @ApiSuccessResponse(200, ReservationResponseDto, { paginated: true })
  @Get()
  async search(
    @Query() searchReservation: SearchReservationDto,
    @Query() paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<ReservationResponseDto>> {
    return await this.reservationService.search(searchReservation, paginationQuery);
  }

  @ApiOperation({ summary: '예약 상세 조회' })
  @ApiSuccessResponse(200, ReservationResponseDto)
  @Get(':id')
  async detail(@Param('id', ParseIntPipe) id: number): Promise<ReservationResponseDto> {
    return await this.reservationService.detail(id);
  }

  @ApiOperation({ summary: '예약 생성' })
  @Post()
  async create(@Body() createReservation: CreateReservationDto): Promise<void> {
    await this.reservationService.create(createReservation);
  }

  @ApiOperation({ summary: '예약 정보 수정' })
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateReservation: UpdateReservationDto): Promise<void> {
    await this.reservationService.update(id, updateReservation);
  }

  @ApiOperation({ summary: '예약 삭제' })
  @Put(':id/delete')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.reservationService.delete(id);
  }
}
