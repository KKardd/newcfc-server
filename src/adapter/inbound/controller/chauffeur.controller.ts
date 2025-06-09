import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateChauffeurDto } from '@/adapter/inbound/dto/request/chauffeur/create-chauffeur.dto';
import { SearchChauffeurDto } from '@/adapter/inbound/dto/request/chauffeur/search-chauffeur.dto';
import { UpdateChauffeurDto } from '@/adapter/inbound/dto/request/chauffeur/update-chauffeur.dto';
import { ChauffeurResponseDto } from '@/adapter/inbound/dto/response/chauffeur/chauffeur-response.dto';
import { ApiSuccessResponse } from '@/adapter/inbound/dto/swagger.decorator';
import { UserRoleType } from '@/domain/enum/user-role.enum';
import { ChauffeurServiceInPort } from '@/port/inbound/chauffeur-service.in-port';
import { JwtAuthGuard } from '@/security/guard/jwt-auth.guard';
import { Roles } from '@/security/guard/user-role.decorator';
import { UserRolesGuard } from '@/security/guard/user-role.guard';

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
}
