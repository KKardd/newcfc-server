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

    // 차량 정보를 DTO로 변환 (Repository에서 이미 JOIN된 정보 사용)
    const vehicleResponseDtos = vehicles.map((vehicle: any) => {
      const vehicleDto = plainToInstance(VehicleResponseDto, vehicle, classTransformDefaultOptions);

      // Repository에서 LEFT JOIN으로 가져온 chauffeur 정보 사용
      vehicleDto.assigned = !!vehicle.chauffeur;

      // 배정된 기사 정보 설정 (JOIN 결과 사용)
      if (vehicle.chauffeur) {
        vehicleDto.chauffeur = plainToInstance(
          ChauffeurInfoDto,
          {
            id: vehicle.chauffeur.id,
            name: vehicle.chauffeur.name,
            phone: vehicle.chauffeur.phone,
            birthDate: vehicle.chauffeur.birthDate,
            profileImageUrl: vehicle.chauffeur.profileImageUrl,
            type: vehicle.chauffeur.type,
            isVehicleAssigned: vehicle.chauffeur.isVehicleAssigned,
            chauffeurStatus: vehicle.chauffeur.chauffeurStatus,
            role: vehicle.chauffeur.role,
            status: vehicle.chauffeur.status,
            createdBy: vehicle.chauffeur.createdBy,
            createdAt: vehicle.chauffeur.createdAt,
            updatedBy: vehicle.chauffeur.updatedBy,
            updatedAt: vehicle.chauffeur.updatedAt,
          },
          classTransformDefaultOptions,
        );
      }

      // 차고지 정보 설정 (JOIN 결과 사용)
      if (vehicle.garage) {
        vehicleDto.garage = plainToInstance(
          GarageInfoDto,
          {
            id: vehicle.garage.id,
            name: vehicle.garage.name,
            address: vehicle.garage.address,
            addressDetail: vehicle.garage.detailAddress,
            status: vehicle.garage.status,
            createdBy: vehicle.garage.createdBy,
            createdAt: vehicle.garage.createdAt,
            updatedBy: vehicle.garage.updatedBy,
            updatedAt: vehicle.garage.updatedAt,
          },
          classTransformDefaultOptions,
        );
      }

      return vehicleDto;
    });

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
    // 해당 차량에 배정된 기사가 있는지 확인
    const assignedChauffeurs = await this.chauffeurServiceOutPort.findByVehicleId(id);

    if (assignedChauffeurs.length > 0) {
      const error = new Error('배정된 기사가 있는 차량은 삭제할 수 없습니다.');
      (error as any).statusCode = 400;
      throw error;
    }

    // 차량 정보(번호, 모델명) 빈문자열 처리 + 상태 DELETED
    await this.vehicleServiceOutPort.update(id, {
      vehicleNumber: '',
      modelName: '',
      status: DataStatus.DELETED,
    });
  }
}
