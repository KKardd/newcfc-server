import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateRealTimeDispatchDto } from '@/adapter/inbound/dto/request/real-time-dispatch/create-real-time-dispatch.dto';
import { SearchRealTimeDispatchDto } from '@/adapter/inbound/dto/request/real-time-dispatch/search-real-time-dispatch.dto';
import { UpdateRealTimeDispatchDto } from '@/adapter/inbound/dto/request/real-time-dispatch/update-real-time-dispatch.dto';
import { RealTimeDispatchResponseDto } from '@/adapter/inbound/dto/response/real-time-dispatch/real-time-dispatch-response.dto';
import { ApiSuccessResponse } from '@/adapter/inbound/dto/swagger.decorator';
import { UserRoleType } from '@/domain/enum/user-role.enum';
import { RealTimeDispatchServiceInPort } from '@/port/inbound/real-time-dispatch-service.in-port';
import { JwtAuthGuard } from '@/security/guard/jwt-auth.guard';
import { Roles } from '@/security/guard/user-role.decorator';
import { UserRolesGuard } from '@/security/guard/user-role.guard';

@ApiTags('RealTimeDispatch')
@ApiBearerAuth()
@Controller('real-time-dispatches')
@UseGuards(JwtAuthGuard, UserRolesGuard)
@Roles(UserRoleType.SUPER_ADMIN)
export class RealTimeDispatchController {
  constructor(private readonly realTimeDispatchService: RealTimeDispatchServiceInPort) {}

  @ApiOperation({ summary: '실시간 배차 목록 조회' })
  @ApiSuccessResponse(200, RealTimeDispatchResponseDto, { paginated: true })
  @Get()
  async search(
    @Query() searchRealTimeDispatch: SearchRealTimeDispatchDto,
    @Query() paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<RealTimeDispatchResponseDto>> {
    return await this.realTimeDispatchService.search(searchRealTimeDispatch, paginationQuery);
  }

  @ApiOperation({ summary: '실시간 배차 상세 조회' })
  @ApiSuccessResponse(200, RealTimeDispatchResponseDto)
  @Get(':id')
  async detail(@Param('id', ParseIntPipe) id: number): Promise<RealTimeDispatchResponseDto> {
    return await this.realTimeDispatchService.detail(id);
  }

  @ApiOperation({ summary: '실시간 배차 생성' })
  @Post()
  async create(@Body() createRealTimeDispatch: CreateRealTimeDispatchDto): Promise<void> {
    await this.realTimeDispatchService.create(createRealTimeDispatch);
  }

  @ApiOperation({ summary: '실시간 배차 정보 수정' })
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateRealTimeDispatch: UpdateRealTimeDispatchDto): Promise<void> {
    await this.realTimeDispatchService.update(id, updateRealTimeDispatch);
  }

  @ApiOperation({ summary: '실시간 배차 삭제' })
  @Put(':id/delete')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.realTimeDispatchService.delete(id);
  }
}
