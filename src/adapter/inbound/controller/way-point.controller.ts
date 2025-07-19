import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateWayPointDto } from '@/adapter/inbound/dto/request/way-point/create-way-point.dto';
import { SearchWayPointDto } from '@/adapter/inbound/dto/request/way-point/search-way-point.dto';
import { UpdateWayPointDto } from '@/adapter/inbound/dto/request/way-point/update-way-point.dto';
import { WayPointResponseDto } from '@/adapter/inbound/dto/response/way-point/way-point-response.dto';
import { UserRoleType } from '@/domain/enum/user-role.enum';
import { WayPointServiceInPort } from '@/port/inbound/way-point-service.in-port';
import { JwtAuthGuard } from '@/security/guard/jwt-auth.guard';
import { Roles } from '@/security/guard/user-role.decorator';
import { UserRolesGuard } from '@/security/guard/user-role.guard';

@ApiTags('WayPoint')
@ApiBearerAuth()
@Controller('way-points')
@UseGuards(JwtAuthGuard, UserRolesGuard)
@Roles(UserRoleType.SUPER_ADMIN, UserRoleType.SUB_ADMIN)
export class WayPointController {
  constructor(private readonly wayPointService: WayPointServiceInPort) {}

  @Get()
  @ApiOperation({ summary: '경유지 목록 조회' })
  @ApiResponse({ status: 200, type: PaginationResponse<WayPointResponseDto> })
  async search(
    @Query() searchWayPoint: SearchWayPointDto,
    @Query() paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<WayPointResponseDto>> {
    return this.wayPointService.search(searchWayPoint, paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: '경유지 상세 조회' })
  @ApiResponse({ status: 200, type: WayPointResponseDto })
  async detail(@Param('id') id: number): Promise<WayPointResponseDto> {
    return this.wayPointService.detail(id);
  }

  @Post()
  @ApiOperation({ summary: '경유지 생성' })
  @ApiResponse({ status: 201 })
  async create(@Body() createWayPoint: CreateWayPointDto): Promise<void> {
    await this.wayPointService.create(createWayPoint);
  }

  @Put(':id')
  @ApiOperation({ summary: '경유지 수정' })
  @ApiResponse({ status: 200 })
  async update(@Param('id') id: number, @Body() updateWayPoint: UpdateWayPointDto): Promise<void> {
    await this.wayPointService.update(id, updateWayPoint);
  }

  @Put(':id/delete')
  @ApiOperation({ summary: '경유지 삭제' })
  @ApiResponse({ status: 200 })
  async delete(@Param('id') id: number): Promise<void> {
    await this.wayPointService.delete(id);
  }
}
