import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateGarageDto } from '@/adapter/inbound/dto/request/garage/create-garage.dto';
import { SearchGarageDto } from '@/adapter/inbound/dto/request/garage/search-garage.dto';
import { UpdateGarageDto } from '@/adapter/inbound/dto/request/garage/update-garage.dto';
import { GarageResponseDto } from '@/adapter/inbound/dto/response/garage/garage-response.dto';
import { ApiSuccessResponse } from '@/adapter/inbound/dto/swagger.decorator';
import { GarageServiceInPort } from '@/port/inbound/garage-service.in-port';

@ApiTags('Garage')
@Controller('garages')
export class GarageController {
  constructor(private readonly garageService: GarageServiceInPort) {}

  @ApiOperation({ summary: '차고 목록 조회' })
  @ApiSuccessResponse(200, GarageResponseDto, { paginated: true })
  @Get()
  async search(
    @Query() searchGarage: SearchGarageDto,
    @Query() paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<GarageResponseDto>> {
    return await this.garageService.search(searchGarage, paginationQuery);
  }

  @ApiOperation({ summary: '차고 상세 조회' })
  @ApiSuccessResponse(200, GarageResponseDto)
  @Get(':id')
  async detail(@Param('id', ParseIntPipe) id: number): Promise<GarageResponseDto> {
    return await this.garageService.detail(id);
  }

  @ApiOperation({ summary: '차고 생성' })
  @Post()
  async create(@Body() createGarage: CreateGarageDto): Promise<void> {
    await this.garageService.create(createGarage);
  }

  @ApiOperation({ summary: '차고 정보 수정' })
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateGarage: UpdateGarageDto): Promise<void> {
    await this.garageService.update(id, updateGarage);
  }

  @ApiOperation({ summary: '차고 삭제' })
  @Put(':id/delete')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.garageService.delete(id);
  }
}
