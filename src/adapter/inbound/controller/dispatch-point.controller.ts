import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateDispatchPointDto } from '@/adapter/inbound/dto/request/dispatch-point/create-dispatch-point.dto';
import { SearchDispatchPointDto } from '@/adapter/inbound/dto/request/dispatch-point/search-dispatch-point.dto';
import { UpdateDispatchPointDto } from '@/adapter/inbound/dto/request/dispatch-point/update-dispatch-point.dto';
import { DispatchPointResponseDto } from '@/adapter/inbound/dto/response/dispatch-point/dispatch-point-response.dto';
import { ApiSuccessResponse } from '@/adapter/inbound/dto/swagger.decorator';
import { UserRoleType } from '@/domain/enum/user-role.enum';
import { DispatchPointServiceInPort } from '@/port/inbound/dispatch-point-service.in-port';
import { JwtAuthGuard } from '@/security/guard/jwt-auth.guard';
import { Roles } from '@/security/guard/user-role.decorator';
import { UserRolesGuard } from '@/security/guard/user-role.guard';

@ApiTags('DispatchPoint')
@ApiBearerAuth()
@Controller('dispatch-points')
@UseGuards(JwtAuthGuard, UserRolesGuard)
@Roles(UserRoleType.SUPER_ADMIN)
export class DispatchPointController {
  constructor(private readonly dispatchPointService: DispatchPointServiceInPort) {}

  @ApiOperation({ summary: '배차 지점 목록 조회' })
  @ApiSuccessResponse(200, DispatchPointResponseDto, { paginated: true })
  @Get()
  async search(
    @Query() searchDispatchPoint: SearchDispatchPointDto,
    @Query() paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<DispatchPointResponseDto>> {
    return await this.dispatchPointService.search(searchDispatchPoint, paginationQuery);
  }

  @ApiOperation({ summary: '배차 지점 상세 조회' })
  @ApiSuccessResponse(200, DispatchPointResponseDto)
  @Get(':id')
  async detail(@Param('id', ParseIntPipe) id: number): Promise<DispatchPointResponseDto> {
    return await this.dispatchPointService.detail(id);
  }

  @ApiOperation({ summary: '배차 지점 생성' })
  @Post()
  async create(@Body() createDispatchPoint: CreateDispatchPointDto): Promise<void> {
    await this.dispatchPointService.create(createDispatchPoint);
  }

  @ApiOperation({ summary: '배차 지점 정보 수정' })
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDispatchPoint: UpdateDispatchPointDto): Promise<void> {
    await this.dispatchPointService.update(id, updateDispatchPoint);
  }

  @ApiOperation({ summary: '배차 지점 삭제' })
  @Put(':id/delete')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.dispatchPointService.delete(id);
  }
}
