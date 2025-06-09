import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateVehicleDto } from '@/adapter/inbound/dto/request/vehicle/create-vehicle.dto';
import { SearchVehicleDto } from '@/adapter/inbound/dto/request/vehicle/search-vehicle.dto';
import { UpdateVehicleDto } from '@/adapter/inbound/dto/request/vehicle/update-vehicle.dto';
import { VehicleResponseDto } from '@/adapter/inbound/dto/response/vehicle/vehicle-response.dto';
import { ApiSuccessResponse } from '@/adapter/inbound/dto/swagger.decorator';
import { UserRoleType } from '@/domain/enum/user-role.enum';
import { VehicleServiceInPort } from '@/port/inbound/vehicle-service.in-port';
import { JwtAuthGuard } from '@/security/guard/jwt-auth.guard';
import { Roles } from '@/security/guard/user-role.decorator';
import { UserRolesGuard } from '@/security/guard/user-role.guard';

@ApiTags('Vehicle')
@ApiBearerAuth()
@Controller('vehicles')
@UseGuards(JwtAuthGuard, UserRolesGuard)
@Roles(UserRoleType.SUPER_ADMIN)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleServiceInPort) {}

  @ApiOperation({ summary: '차량 목록 조회' })
  @ApiSuccessResponse(200, VehicleResponseDto, { paginated: true })
  @Get()
  async search(
    @Query() searchVehicle: SearchVehicleDto,
    @Query() paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<VehicleResponseDto>> {
    return await this.vehicleService.search(searchVehicle, paginationQuery);
  }

  @ApiOperation({ summary: '차량 상세 조회' })
  @ApiSuccessResponse(200, VehicleResponseDto)
  @Get(':id')
  async detail(@Param('id', ParseIntPipe) id: number): Promise<VehicleResponseDto> {
    return await this.vehicleService.detail(id);
  }

  @ApiOperation({ summary: '차량 생성' })
  @Post()
  async create(@Body() createVehicle: CreateVehicleDto): Promise<void> {
    await this.vehicleService.create(createVehicle);
  }

  @ApiOperation({ summary: '차량 정보 수정' })
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateVehicle: UpdateVehicleDto): Promise<void> {
    await this.vehicleService.update(id, updateVehicle);
  }

  @ApiOperation({ summary: '차량 삭제' })
  @Put(':id/delete')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.vehicleService.delete(id);
  }
}
