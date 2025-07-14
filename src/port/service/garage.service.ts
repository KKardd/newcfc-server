import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { Pagination, PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateGarageDto } from '@/adapter/inbound/dto/request/garage/create-garage.dto';
import { SearchGarageDto } from '@/adapter/inbound/dto/request/garage/search-garage.dto';
import { UpdateGarageDto } from '@/adapter/inbound/dto/request/garage/update-garage.dto';
import { GarageResponseDto } from '@/adapter/inbound/dto/response/garage/garage-response.dto';
import { Garage } from '@/domain/entity/garage.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { GarageServiceInPort } from '@/port/inbound/garage-service.in-port';
import { GarageServiceOutPort } from '@/port/outbound/garage-service.out-port';
import { VehicleServiceOutPort } from '@/port/outbound/vehicle-service.out-port';
import { classTransformDefaultOptions } from '@/validate/serialization';

@Injectable()
export class GarageService implements GarageServiceInPort {
  constructor(
    private readonly garageServiceOutPort: GarageServiceOutPort,
    private readonly vehicleServiceOutPort: VehicleServiceOutPort,
  ) {}

  async search(searchGarage: SearchGarageDto, paginationQuery: PaginationQuery): Promise<PaginationResponse<GarageResponseDto>> {
    const [garages, totalCount] = await this.garageServiceOutPort.findAll(searchGarage, paginationQuery, DataStatus.DELETED);
    const pagination = new Pagination({ totalCount, paginationQuery });

    // 각 차고지에 대해 배정된 차량 수를 계산
    const garageResponseDtos = await Promise.all(
      garages.map(async (garage) => {
        const garageDto = plainToInstance(GarageResponseDto, garage, classTransformDefaultOptions);

        // 해당 차고지에 속한 차량 수 조회 (삭제되지 않은 차량만)
        try {
          const vehicleCount = await this.vehicleServiceOutPort.countByGarageId(garage.id);
          garageDto.vehicleCount = vehicleCount;
        } catch (error) {
          garageDto.vehicleCount = 0;
        }

        return garageDto;
      }),
    );

    return new PaginationResponse(garageResponseDtos, pagination);
  }

  async detail(id: number): Promise<GarageResponseDto> {
    const garage = await this.garageServiceOutPort.findById(id);
    if (!garage) throw new Error('차고지를 찾을 수 없습니다.');

    const garageDto = plainToInstance(GarageResponseDto, garage, classTransformDefaultOptions);

    // 해당 차고지에 속한 차량 수 조회 (삭제되지 않은 차량만)
    try {
      const vehicleCount = await this.vehicleServiceOutPort.countByGarageId(garage.id);
      garageDto.vehicleCount = vehicleCount;
    } catch (error) {
      garageDto.vehicleCount = 0;
    }

    return garageDto;
  }

  async create(createGarage: CreateGarageDto): Promise<void> {
    const garage = plainToInstance(Garage, createGarage);
    await this.garageServiceOutPort.save(garage);
  }

  async update(id: number, updateGarage: UpdateGarageDto): Promise<void> {
    await this.garageServiceOutPort.update(id, updateGarage);
  }

  async delete(id: number): Promise<void> {
    await this.garageServiceOutPort.updateStatus(id, DataStatus.DELETED);
  }
}
