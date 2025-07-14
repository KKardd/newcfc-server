import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { Pagination, PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateVehicleDto } from '@/adapter/inbound/dto/request/vehicle/create-vehicle.dto';
import { SearchVehicleDto } from '@/adapter/inbound/dto/request/vehicle/search-vehicle.dto';
import { UpdateVehicleDto } from '@/adapter/inbound/dto/request/vehicle/update-vehicle.dto';
import { VehicleResponseDto, ChauffeurInfoDto, GarageInfoDto } from '@/adapter/inbound/dto/response/vehicle/vehicle-response.dto';
import { Vehicle } from '@/domain/entity/vehicle.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { VehicleServiceInPort } from '@/port/inbound/vehicle-service.in-port';
import { ChauffeurServiceOutPort } from '@/port/outbound/chauffeur-service.out-port';
import { VehicleServiceOutPort } from '@/port/outbound/vehicle-service.out-port';
import { GarageServiceOutPort } from '@/port/outbound/garage-service.out-port';
import { classTransformDefaultOptions } from '@/validate/serialization';

@Injectable()
export class VehicleService implements VehicleServiceInPort {
  constructor(
    private readonly vehicleServiceOutPort: VehicleServiceOutPort,
    private readonly chauffeurServiceOutPort: ChauffeurServiceOutPort,
    private readonly garageServiceOutPort: GarageServiceOutPort,
  ) {}

  async search(
    searchVehicle: SearchVehicleDto,
    paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<VehicleResponseDto>> {
    // 삭제 제외 조회
    const [vehicles, totalCount] = await this.vehicleServiceOutPort.findAll(searchVehicle, paginationQuery, DataStatus.DELETED);
    const pagination = new Pagination({ totalCount, paginationQuery });

    // 각 차량의 배정 여부를 계산하고 관련 정보 조회
    const vehicleResponseDtos = await Promise.all(
      vehicles.map(async (vehicle) => {
        const vehicleDto = plainToInstance(VehicleResponseDto, vehicle, classTransformDefaultOptions);

        // 해당 차량에 배정된 기사가 있는지 확인
        const chauffeurs = await this.chauffeurServiceOutPort.findByVehicleId(vehicle.id);

        vehicleDto.assigned = chauffeurs.length > 0;

        // 배정된 기사 정보 조회 (첫 번째 기사)
        if (chauffeurs.length > 0) {
          const chauffeur = chauffeurs[0];
          vehicleDto.chauffeur = plainToInstance(
            ChauffeurInfoDto,
            {
              id: chauffeur.id,
              name: chauffeur.name,
              phone: chauffeur.phone,
              birthDate: chauffeur.birthDate,
              profileImageUrl: chauffeur.profileImageUrl,
              type: chauffeur.type,
              isVehicleAssigned: chauffeur.isVehicleAssigned,
              chauffeurStatus: chauffeur.chauffeurStatus,
              role: chauffeur.role,
              status: chauffeur.status,
              createdBy: chauffeur.createdBy,
              createdAt: chauffeur.createdAt,
              updatedBy: chauffeur.updatedBy,
              updatedAt: chauffeur.updatedAt,
            },
            classTransformDefaultOptions,
          );
        }

        // 차고지 정보 조회
        if (vehicle.garageId) {
          try {
            const garage = await this.garageServiceOutPort.findById(vehicle.garageId);
            if (garage) {
              vehicleDto.garage = plainToInstance(
                GarageInfoDto,
                {
                  id: garage.id,
                  name: garage.name,
                  address: garage.address,
                  addressDetail: garage.detailAddress,
                  status: garage.status,
                  createdBy: garage.createdBy,
                  createdAt: garage.createdAt,
                  updatedBy: garage.updatedBy,
                  updatedAt: garage.updatedAt,
                },
                classTransformDefaultOptions,
              );
            }
          } catch (error) {
            vehicleDto.garage = null;
          }
        }

        return vehicleDto;
      }),
    );

    return new PaginationResponse(vehicleResponseDtos, pagination);
  }

  async detail(id: number): Promise<VehicleResponseDto> {
    const vehicle = await this.vehicleServiceOutPort.findById(id);
    if (!vehicle) throw new Error('차량을 찾을 수 없습니다.');

    const vehicleDto = plainToInstance(VehicleResponseDto, vehicle, classTransformDefaultOptions);

    // 해당 차량에 배정된 기사가 있는지 확인
    const chauffeurs = await this.chauffeurServiceOutPort.findByVehicleId(vehicle.id);

    vehicleDto.assigned = chauffeurs.length > 0;

    // 배정된 기사 정보 조회 (첫 번째 기사)
    if (chauffeurs.length > 0) {
      const chauffeur = chauffeurs[0];
      vehicleDto.chauffeur = plainToInstance(
        ChauffeurInfoDto,
        {
          id: chauffeur.id,
          name: chauffeur.name,
          phone: chauffeur.phone,
          birthDate: chauffeur.birthDate,
          profileImageUrl: chauffeur.profileImageUrl,
          type: chauffeur.type,
          isVehicleAssigned: chauffeur.isVehicleAssigned,
          chauffeurStatus: chauffeur.chauffeurStatus,
          role: chauffeur.role,
          status: chauffeur.status,
          createdBy: chauffeur.createdBy,
          createdAt: chauffeur.createdAt,
          updatedBy: chauffeur.updatedBy,
          updatedAt: chauffeur.updatedAt,
        },
        classTransformDefaultOptions,
      );
    }

    // 차고지 정보 조회
    if (vehicle.garageId) {
      try {
        const garage = await this.garageServiceOutPort.findById(vehicle.garageId);
        if (garage) {
          vehicleDto.garage = plainToInstance(
            GarageInfoDto,
            {
              id: garage.id,
              name: garage.name,
              address: garage.address,
              addressDetail: garage.detailAddress,
              status: garage.status,
              createdBy: garage.createdBy,
              createdAt: garage.createdAt,
              updatedBy: garage.updatedBy,
              updatedAt: garage.updatedAt,
            },
            classTransformDefaultOptions,
          );
        }
      } catch (error) {
        vehicleDto.garage = null;
      }
    }

    return vehicleDto;
  }

  async create(createVehicle: CreateVehicleDto): Promise<void> {
    const vehicle = plainToInstance(Vehicle, createVehicle);
    await this.vehicleServiceOutPort.save(vehicle);
  }

  async update(id: number, updateVehicle: UpdateVehicleDto): Promise<void> {
    await this.vehicleServiceOutPort.update(id, updateVehicle);
  }

  async delete(id: number): Promise<void> {
    await this.vehicleServiceOutPort.updateStatus(id, DataStatus.DELETED);
  }
}
