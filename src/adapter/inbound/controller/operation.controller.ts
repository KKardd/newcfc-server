import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateOperationDto } from '@/adapter/inbound/dto/request/operation/create-operation.dto';
import { SearchOperationDto } from '@/adapter/inbound/dto/request/operation/search-operation.dto';
import { UpdateOperationDto } from '@/adapter/inbound/dto/request/operation/update-operation.dto';
import { OperationResponseDto } from '@/adapter/inbound/dto/response/operation/operation-response.dto';
import { ApiSuccessResponse } from '@/adapter/inbound/dto/swagger.decorator';
import { UserRoleType } from '@/domain/enum/user-role.enum';
import { OperationServiceInPort } from '@/port/inbound/operation-service.in-port';
import { JwtAuthGuard } from '@/security/guard/jwt-auth.guard';
import { Roles } from '@/security/guard/user-role.decorator';
import { UserRolesGuard } from '@/security/guard/user-role.guard';

@ApiTags('Operation')
@Controller('operations')
@UseGuards(JwtAuthGuard, UserRolesGuard)
@Roles(UserRoleType.CHAUFFEUR)
export class OperationController {
  constructor(private readonly operationService: OperationServiceInPort) {}

  @ApiOperation({ summary: '운행 목록 조회' })
  @ApiSuccessResponse(200, OperationResponseDto, { paginated: true })
  @Get()
  async search(
    @Query() searchOperation: SearchOperationDto,
    @Query() paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<OperationResponseDto>> {
    return await this.operationService.search(searchOperation, paginationQuery);
  }

  @ApiOperation({ summary: '운행 상세 조회' })
  @ApiSuccessResponse(200, OperationResponseDto)
  @Get(':id')
  async detail(@Param('id', ParseIntPipe) id: number): Promise<OperationResponseDto> {
    return await this.operationService.detail(id);
  }

  @ApiOperation({ summary: '운행 생성' })
  @Post()
  async create(@Body() createOperation: CreateOperationDto): Promise<void> {
    await this.operationService.create(createOperation);
  }

  @ApiOperation({ summary: '운행 정보 수정' })
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateOperation: UpdateOperationDto): Promise<void> {
    await this.operationService.update(id, updateOperation);
  }

  @ApiOperation({ summary: '운행 삭제' })
  @Put(':id/delete')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.operationService.delete(id);
  }
}
