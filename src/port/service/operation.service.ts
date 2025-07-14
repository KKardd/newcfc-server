import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { Pagination, PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { AssignChauffeurDto } from '@/adapter/inbound/dto/request/admin/assign-chauffeur.dto';
import { CreateOperationDto } from '@/adapter/inbound/dto/request/operation/create-operation.dto';
import { SearchOperationDto } from '@/adapter/inbound/dto/request/operation/search-operation.dto';
import { UpdateOperationDto } from '@/adapter/inbound/dto/request/operation/update-operation.dto';
import { AssignChauffeurResponseDto } from '@/adapter/inbound/dto/response/admin/assign-chauffeur-response.dto';
import {
  OperationResponseDto,
  ChauffeurInfoDto,
  VehicleInfoDto,
  GarageInfoDto,
  RealTimeDispatchInfoDto,
  ReservationInfoDto,
  WayPointInfoDto,
} from '@/adapter/inbound/dto/response/operation/operation-response.dto';
import { Operation } from '@/domain/entity/operation.entity';
import { ChauffeurStatus } from '@/domain/enum/chauffeur-status.enum';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { OperationType } from '@/domain/enum/operation-type.enum';
import { OperationServiceInPort } from '@/port/inbound/operation-service.in-port';
import { ReservationServiceInPort } from '@/port/inbound/reservation-service.in-port';
import { WayPointServiceInPort } from '@/port/inbound/way-point-service.in-port';
import { ChauffeurServiceOutPort } from '@/port/outbound/chauffeur-service.out-port';
import { OperationServiceOutPort } from '@/port/outbound/operation-service.out-port';
import { RealTimeDispatchServiceOutPort } from '@/port/outbound/real-time-dispatch-service.out-port';
import { VehicleServiceOutPort } from '@/port/outbound/vehicle-service.out-port';
import { GarageServiceOutPort } from '@/port/outbound/garage-service.out-port';
import { ReservationServiceOutPort } from '@/port/outbound/reservation-service.out-port';
import { classTransformDefaultOptions } from '@/validate/serialization';

// 관리자용 운행 상세 응답 DTO
export class AdminOperationDetailResponseDto {
  id: number;
  type: OperationType;
  isRepeated: boolean;
  startTime: Date | null;
  endTime: Date | null;
  distance: number | null;
  chauffeurId: number | null;
  chauffeurName: string | null;
  chauffeurPhone: string | null;
  passengerCount: number | null;
  vehicleId: number | null;
  realTimeDispatchId: number | null;
  additionalCosts: any | null;
  receiptImageUrls: string[] | null;
  kakaoPath: any | null;
  status: DataStatus;
  createdBy: number;
  createdAt: Date;
  updatedBy: number;
  updatedAt: Date;

  // 관련 엔티티 정보
  chauffeur: any | null;
  vehicle: any | null;
  garage: any | null;
  realTimeDispatch: any | null;
  reservation: any | null;

  // 진행상태가 포함된 waypoints
  wayPoints: AdminWayPointDto[];
}

export class AdminWayPointDto {
  id: number;
  name: string | null;
  address: string;
  addressDetail: string | null;
  order: number;
  visitTime: Date | null;
  chauffeurStatus: ChauffeurStatus | null;
  progressStatus: 'COMPLETED' | 'IN_PROGRESS' | 'WAITING' | 'PENDING';
  progressLabel: string;
  progressLabelStatus: ChauffeurStatus | null;
}

@Injectable()
export class OperationService implements OperationServiceInPort {
  constructor(
    private readonly operationServiceOutPort: OperationServiceOutPort,
    private readonly chauffeurServiceOutPort: ChauffeurServiceOutPort,
    private readonly vehicleServiceOutPort: VehicleServiceOutPort,
    private readonly garageServiceOutPort: GarageServiceOutPort,
    private readonly reservationServiceInPort: ReservationServiceInPort,
    private readonly reservationServiceOutPort: ReservationServiceOutPort,
    private readonly wayPointServiceInPort: WayPointServiceInPort,
    private readonly realTimeDispatchServiceOutPort: RealTimeDispatchServiceOutPort,
  ) {}

  async search(
    searchOperation: SearchOperationDto,
    paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<OperationResponseDto>> {
    const [operations, totalCount] = await this.operationServiceOutPort.findAll(
      searchOperation,
      paginationQuery,
      DataStatus.DELETED,
    );
    const pagination = new Pagination({ totalCount, paginationQuery });

    // 각 운행에 대해 관련 데이터를 조회하고 매핑
    const operationDtos = await Promise.all(
      operations.map(async (operation) => {
        const operationDto = plainToInstance(OperationResponseDto, operation, classTransformDefaultOptions);

        // 기사 정보 조회
        if (operation.chauffeurId) {
          try {
            const chauffeur = await this.chauffeurServiceOutPort.findById(operation.chauffeurId);
            if (chauffeur) {
              operationDto.chauffeur = plainToInstance(
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
                  vehicleId: chauffeur.vehicleId,
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
          } catch (error) {
            // 기사 정보를 찾을 수 없는 경우
            operationDto.chauffeur = null;
          }
        }

        // 차량 정보 조회
        if (operation.vehicleId) {
          try {
            const vehicle = await this.vehicleServiceOutPort.findById(operation.vehicleId);
            if (vehicle) {
              operationDto.vehicle = plainToInstance(
                VehicleInfoDto,
                {
                  id: vehicle.id,
                  vehicleNumber: vehicle.vehicleNumber,
                  modelName: vehicle.modelName,
                  garageId: vehicle.garageId,
                  vehicleStatus: vehicle.vehicleStatus,
                  status: vehicle.status,
                  createdBy: vehicle.createdBy,
                  createdAt: vehicle.createdAt,
                  updatedBy: vehicle.updatedBy,
                  updatedAt: vehicle.updatedAt,
                },
                classTransformDefaultOptions,
              );

              // 차고지 정보 조회
              if (vehicle.garageId) {
                try {
                  const garage = await this.garageServiceOutPort.findById(vehicle.garageId);
                  if (garage) {
                    operationDto.garage = plainToInstance(
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
                  operationDto.garage = null;
                }
              }
            }
          } catch (error) {
            operationDto.vehicle = null;
          }
        }

        // 실시간 배차 정보 조회
        if (operation.realTimeDispatchId) {
          try {
            const realTimeDispatch = await this.realTimeDispatchServiceOutPort.findById(operation.realTimeDispatchId);
            if (realTimeDispatch) {
              operationDto.realTimeDispatch = plainToInstance(
                RealTimeDispatchInfoDto,
                {
                  id: realTimeDispatch.id,
                  departureName: realTimeDispatch.departureName,
                  departureAddress: realTimeDispatch.departureAddress,
                  departureAddressDetail: realTimeDispatch.departureAddressDetail,
                  destinationName: realTimeDispatch.destinationName,
                  destinationAddress: realTimeDispatch.destinationAddress,
                  destinationAddressDetail: realTimeDispatch.destinationAddressDetail,
                  status: realTimeDispatch.status,
                  createdBy: realTimeDispatch.createdBy,
                  createdAt: realTimeDispatch.createdAt,
                  updatedBy: realTimeDispatch.updatedBy,
                  updatedAt: realTimeDispatch.updatedAt,
                },
                classTransformDefaultOptions,
              );
            }
          } catch (error) {
            operationDto.realTimeDispatch = null;
          }
        }

        // 예약 정보 조회
        try {
          const reservationPagination = new PaginationQuery();
          reservationPagination.page = 1;
          reservationPagination.countPerPage = 1;

          const [reservations] = await this.reservationServiceOutPort.findAll(
            { operationId: operation.id },
            reservationPagination,
            DataStatus.DELETED,
          );

          if (reservations.length > 0) {
            const reservation = reservations[0];
            operationDto.reservation = plainToInstance(
              ReservationInfoDto,
              {
                id: reservation.id,
                operationId: reservation.operationId,
                passengerName: reservation.passengerName,
                passengerPhone: reservation.passengerPhone,
                passengerEmail: reservation.passengerEmail,
                passengerCount: reservation.passengerCount,
                safetyPhone: reservation.safetyPhone,
                memo: reservation.memo,
                status: reservation.status,
                createdBy: reservation.createdBy,
                createdAt: reservation.createdAt,
                updatedBy: reservation.updatedBy,
                updatedAt: reservation.updatedAt,
              },
              classTransformDefaultOptions,
            );
          }
        } catch (error) {
          operationDto.reservation = null;
        }

        // 경유지 정보 조회
        try {
          const wayPointPagination = new PaginationQuery();
          wayPointPagination.page = 1;
          wayPointPagination.countPerPage = 100;

          const wayPoints = await this.wayPointServiceInPort.search({ operationId: operation.id }, wayPointPagination);
          operationDto.wayPoints = wayPoints.data
            .sort((a, b) => a.order - b.order)
            .map((wp) =>
              plainToInstance(
                WayPointInfoDto,
                {
                  id: wp.id,
                  operationId: wp.operationId,
                  name: wp.name,
                  address: wp.address,
                  addressDetail: wp.addressDetail,
                  chauffeurStatus: wp.chauffeurStatus,
                  latitude: wp.latitude,
                  longitude: wp.longitude,
                  visitTime: wp.visitTime,
                  order: wp.order,
                  status: wp.status,
                  createdBy: wp.createdBy,
                  createdAt: wp.createdAt,
                  updatedBy: wp.updatedBy,
                  updatedAt: wp.updatedAt,
                },
                classTransformDefaultOptions,
              ),
            );
        } catch (error) {
          operationDto.wayPoints = [];
        }

        return operationDto;
      }),
    );

    return new PaginationResponse(operationDtos, pagination);
  }

  async detail(id: number): Promise<OperationResponseDto> {
    const operation = await this.operationServiceOutPort.findByIdWithDetails(id);
    if (!operation) throw new Error('운행 정보를 찾을 수 없습니다.');

    // search 메서드와 동일한 로직으로 관련 데이터 조회 및 매핑
    const operationDto = plainToInstance(OperationResponseDto, operation, classTransformDefaultOptions);

    // 기사, 차량, 실시간 배차, 예약, 경유지 정보 매핑 (위와 동일한 로직을 반복)
    // 기사 정보 조회
    if (operation.chauffeurId) {
      try {
        const chauffeur = await this.chauffeurServiceOutPort.findById(operation.chauffeurId);
        if (chauffeur) {
          operationDto.chauffeur = plainToInstance(
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
              vehicleId: chauffeur.vehicleId,
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
      } catch (error) {
        // 기사 정보를 찾을 수 없는 경우
        operationDto.chauffeur = null;
      }
    }

    // 차량 정보 조회
    if (operation.vehicleId) {
      try {
        const vehicle = await this.vehicleServiceOutPort.findById(operation.vehicleId);
        if (vehicle) {
          operationDto.vehicle = plainToInstance(
            VehicleInfoDto,
            {
              id: vehicle.id,
              vehicleNumber: vehicle.vehicleNumber,
              modelName: vehicle.modelName,
              garageId: vehicle.garageId,
              vehicleStatus: vehicle.vehicleStatus,
              status: vehicle.status,
              createdBy: vehicle.createdBy,
              createdAt: vehicle.createdAt,
              updatedBy: vehicle.updatedBy,
              updatedAt: vehicle.updatedAt,
            },
            classTransformDefaultOptions,
          );

          // 차고지 정보 조회
          if (vehicle.garageId) {
            try {
              const garage = await this.garageServiceOutPort.findById(vehicle.garageId);
              if (garage) {
                operationDto.garage = plainToInstance(
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
              operationDto.garage = null;
            }
          }
        }
      } catch (error) {
        operationDto.vehicle = null;
      }
    }

    // 실시간 배차 정보 조회
    if (operation.realTimeDispatchId) {
      try {
        const realTimeDispatch = await this.realTimeDispatchServiceOutPort.findById(operation.realTimeDispatchId);
        if (realTimeDispatch) {
          operationDto.realTimeDispatch = plainToInstance(
            RealTimeDispatchInfoDto,
            {
              id: realTimeDispatch.id,
              departureName: realTimeDispatch.departureName,
              departureAddress: realTimeDispatch.departureAddress,
              departureAddressDetail: realTimeDispatch.departureAddressDetail,
              destinationName: realTimeDispatch.destinationName,
              destinationAddress: realTimeDispatch.destinationAddress,
              destinationAddressDetail: realTimeDispatch.destinationAddressDetail,
              status: realTimeDispatch.status,
              createdBy: realTimeDispatch.createdBy,
              createdAt: realTimeDispatch.createdAt,
              updatedBy: realTimeDispatch.updatedBy,
              updatedAt: realTimeDispatch.updatedAt,
            },
            classTransformDefaultOptions,
          );
        }
      } catch (error) {
        operationDto.realTimeDispatch = null;
      }
    }

    // 예약 정보 조회
    try {
      const reservationPagination = new PaginationQuery();
      reservationPagination.page = 1;
      reservationPagination.countPerPage = 1;

      const [reservations] = await this.reservationServiceOutPort.findAll(
        { operationId: operation.id },
        reservationPagination,
        DataStatus.DELETED,
      );

      if (reservations.length > 0) {
        const reservation = reservations[0];
        operationDto.reservation = plainToInstance(
          ReservationInfoDto,
          {
            id: reservation.id,
            operationId: reservation.operationId,
            passengerName: reservation.passengerName,
            passengerPhone: reservation.passengerPhone,
            passengerEmail: reservation.passengerEmail,
            passengerCount: reservation.passengerCount,
            safetyPhone: reservation.safetyPhone,
            memo: reservation.memo,
            status: reservation.status,
            createdBy: reservation.createdBy,
            createdAt: reservation.createdAt,
            updatedBy: reservation.updatedBy,
            updatedAt: reservation.updatedAt,
          },
          classTransformDefaultOptions,
        );
      }
    } catch (error) {
      operationDto.reservation = null;
    }

    // 경유지 정보 조회
    try {
      const wayPointPagination = new PaginationQuery();
      wayPointPagination.page = 1;
      wayPointPagination.countPerPage = 100;

      const wayPoints = await this.wayPointServiceInPort.search({ operationId: operation.id }, wayPointPagination);
      operationDto.wayPoints = wayPoints.data
        .sort((a, b) => a.order - b.order)
        .map((wp) =>
          plainToInstance(
            WayPointInfoDto,
            {
              id: wp.id,
              operationId: wp.operationId,
              name: wp.name,
              address: wp.address,
              addressDetail: wp.addressDetail,
              chauffeurStatus: wp.chauffeurStatus,
              latitude: wp.latitude,
              longitude: wp.longitude,
              visitTime: wp.visitTime,
              order: wp.order,
              status: wp.status,
              createdBy: wp.createdBy,
              createdAt: wp.createdAt,
              updatedBy: wp.updatedBy,
              updatedAt: wp.updatedAt,
            },
            classTransformDefaultOptions,
          ),
        );
    } catch (error) {
      operationDto.wayPoints = [];
    }

    return operationDto;
  }

  /**
   * 관리자용 운행 상세 조회 - waypoint 진행 상태 포함
   */
  async getAdminOperationDetail(id: number): Promise<AdminOperationDetailResponseDto> {
    const operationDetail = await this.operationServiceOutPort.findByIdWithDetails(id);
    if (!operationDetail) throw new Error('운행 정보를 찾을 수 없습니다.');

    // 기본 응답 구성 (기존 OperationResponseDto와 동일한 정보)
    const response = new AdminOperationDetailResponseDto();
    response.id = operationDetail.id;
    response.type = operationDetail.type;
    response.isRepeated = operationDetail.isRepeated;
    response.startTime = operationDetail.startTime;
    response.endTime = operationDetail.endTime;
    response.distance = operationDetail.distance;
    response.chauffeurId = operationDetail.chauffeurId;
    response.chauffeurName = (operationDetail as any).chauffeurName;
    response.chauffeurPhone = (operationDetail as any).chauffeurPhone;
    response.passengerCount = (operationDetail as any).passengerCount;
    response.vehicleId = operationDetail.vehicleId;
    response.realTimeDispatchId = operationDetail.realTimeDispatchId;
    response.additionalCosts = operationDetail.additionalCosts;
    response.receiptImageUrls = operationDetail.receiptImageUrls;
    response.kakaoPath = operationDetail.kakaoPath;
    response.status = operationDetail.status;
    response.createdBy = operationDetail.createdBy;
    response.createdAt = operationDetail.createdAt;
    response.updatedBy = operationDetail.updatedBy;
    response.updatedAt = operationDetail.updatedAt;

    // 관련 엔티티 정보 설정
    response.chauffeur = (operationDetail as any).chauffeur;
    response.vehicle = (operationDetail as any).vehicle;
    response.garage = (operationDetail as any).garage;
    response.realTimeDispatch = (operationDetail as any).realTimeDispatch;
    response.reservation = (operationDetail as any).reservation;

    // 기사의 현재 상태 조회 (진행상태 계산을 위해)
    let chauffeurStatus: ChauffeurStatus | null = null;
    if ((operationDetail as any).chauffeur) {
      chauffeurStatus = (operationDetail as any).chauffeur.chauffeurStatus;
    }

    // WayPoint 정보를 진행 상태와 함께 계산
    const sortedWayPoints = ((operationDetail as any).wayPoints || []).sort((a: any, b: any) => a.order - b.order);
    response.wayPoints = sortedWayPoints.map((wp: any) => this.calculateWayPointProgress(wp, chauffeurStatus, sortedWayPoints));

    return response;
  }

  /**
   * WayPoint의 진행 상태 계산
   */
  private calculateWayPointProgress(
    wayPoint: any,
    chauffeurStatus: ChauffeurStatus | null,
    allWayPoints: any[],
  ): AdminWayPointDto {
    const adminWayPoint = new AdminWayPointDto();
    adminWayPoint.id = wayPoint.id;
    adminWayPoint.name = wayPoint.name;
    adminWayPoint.address = wayPoint.address;
    adminWayPoint.addressDetail = wayPoint.addressDetail;
    adminWayPoint.order = wayPoint.order;
    adminWayPoint.visitTime = wayPoint.visitTime;
    adminWayPoint.chauffeurStatus = wayPoint.chauffeurStatus;

    // 진행 상태 계산
    if (wayPoint.chauffeurStatus && wayPoint.visitTime) {
      // 방문 완료
      adminWayPoint.progressStatus = 'COMPLETED';
      const labelData = this.getProgressLabel(wayPoint.chauffeurStatus, 'COMPLETED');
      adminWayPoint.progressLabel = labelData.label;
      adminWayPoint.progressLabelStatus = labelData.status;
    } else if (chauffeurStatus && this.isCurrentWayPoint(wayPoint, chauffeurStatus, allWayPoints)) {
      // 현재 진행 중
      adminWayPoint.progressStatus = 'IN_PROGRESS';
      const labelData = this.getProgressLabel(chauffeurStatus, 'IN_PROGRESS');
      adminWayPoint.progressLabel = labelData.label;
      adminWayPoint.progressLabelStatus = labelData.status;
    } else if (this.isWaitingWayPoint(wayPoint, allWayPoints)) {
      // 대기 중
      adminWayPoint.progressStatus = 'WAITING';
      const labelData = this.getProgressLabel(null, 'WAITING');
      adminWayPoint.progressLabel = labelData.label;
      adminWayPoint.progressLabelStatus = labelData.status;
    } else {
      // 미정
      adminWayPoint.progressStatus = 'PENDING';
      const labelData = this.getProgressLabel(null, 'PENDING');
      adminWayPoint.progressLabel = labelData.label;
      adminWayPoint.progressLabelStatus = labelData.status;
    }

    return adminWayPoint;
  }

  /**
   * 현재 진행 중인 waypoint인지 확인
   */
  private isCurrentWayPoint(wayPoint: any, chauffeurStatus: ChauffeurStatus, allWayPoints: any[]): boolean {
    switch (chauffeurStatus) {
      case ChauffeurStatus.MOVING_TO_DEPARTURE:
      case ChauffeurStatus.WAITING_FOR_PASSENGER:
        return wayPoint.order === 1;

      case ChauffeurStatus.IN_OPERATION:
        // 방문하지 않은 waypoint 중 첫 번째
        const unvisitedWayPoints = allWayPoints.filter((wp) => !wp.chauffeurStatus || !wp.visitTime);
        return unvisitedWayPoints.length > 0 && unvisitedWayPoints[0].id === wayPoint.id;

      case ChauffeurStatus.WAITING_OPERATION:
        // 가장 최근에 방문한 waypoint
        const visitedWayPoints = allWayPoints.filter((wp) => wp.chauffeurStatus && wp.visitTime);
        if (visitedWayPoints.length > 0) {
          const latest = visitedWayPoints.sort((a, b) => new Date(b.visitTime).getTime() - new Date(a.visitTime).getTime())[0];
          return latest.id === wayPoint.id;
        }
        return false;

      case ChauffeurStatus.OPERATION_COMPLETED:
        return wayPoint.order === allWayPoints.length; // 마지막 waypoint

      default:
        return false;
    }
  }

  /**
   * 대기 상태인 waypoint인지 확인
   */
  private isWaitingWayPoint(wayPoint: any, allWayPoints: any[]): boolean {
    // 방문하지 않은 waypoint들 중에서 현재 진행 중이 아닌 것들
    return !wayPoint.chauffeurStatus && !wayPoint.visitTime;
  }

  /**
   * 진행 상태 라벨 생성
   */
  private getProgressLabel(
    chauffeurStatus: ChauffeurStatus | null,
    progressStatus: string,
  ): { label: string; status: ChauffeurStatus | null } {
    if (progressStatus === 'COMPLETED') {
      switch (chauffeurStatus) {
        case ChauffeurStatus.WAITING_FOR_PASSENGER:
          return { label: '완료', status: ChauffeurStatus.WAITING_FOR_PASSENGER };
        case ChauffeurStatus.IN_OPERATION:
          return { label: '완료', status: ChauffeurStatus.IN_OPERATION };
        case ChauffeurStatus.WAITING_OPERATION:
          return { label: '완료', status: ChauffeurStatus.WAITING_OPERATION };
        case ChauffeurStatus.OPERATION_COMPLETED:
          return { label: '완료', status: ChauffeurStatus.OPERATION_COMPLETED };
        default:
          return { label: '완료', status: null };
      }
    } else if (progressStatus === 'IN_PROGRESS') {
      switch (chauffeurStatus) {
        case ChauffeurStatus.MOVING_TO_DEPARTURE:
          return { label: '진행중', status: ChauffeurStatus.MOVING_TO_DEPARTURE };
        case ChauffeurStatus.WAITING_FOR_PASSENGER:
          return { label: '진행중', status: ChauffeurStatus.WAITING_FOR_PASSENGER };
        case ChauffeurStatus.IN_OPERATION:
          return { label: '진행중', status: ChauffeurStatus.IN_OPERATION };
        case ChauffeurStatus.WAITING_OPERATION:
          return { label: '진행중', status: ChauffeurStatus.WAITING_OPERATION };
        case ChauffeurStatus.PENDING_RECEIPT_INPUT:
          return { label: '진행중', status: ChauffeurStatus.PENDING_RECEIPT_INPUT };
        default:
          return { label: '진행중', status: null };
      }
    } else if (progressStatus === 'WAITING') {
      return { label: '대기', status: null };
    } else {
      return { label: '미정', status: null };
    }
  }

  async create(createOperation: CreateOperationDto): Promise<void> {
    // 1. Operation 엔티티 생성
    const operation = plainToInstance(Operation, {
      type: createOperation.type,
      isRepeated: createOperation.schedule.isRepeat || false,
      chauffeurId: createOperation.chauffeurId,
      vehicleId: createOperation.vehicleId,
      realTimeDispatchId: createOperation.schedule.realTimeDispatchId,
      status: DataStatus.REGISTER,
    });

    // 2. Operation 저장
    await this.operationServiceOutPort.save(operation);

    // 3. Reservation 생성 및 저장
    await this.reservationServiceInPort.create({
      operationId: operation.id,
      passengerName: createOperation.reservation.passengerName,
      passengerPhone: createOperation.reservation.passengerPhone,
      passengerEmail: createOperation.reservation.passengerEmail,
      passengerCount: createOperation.reservation.passengerCount,
      memo: createOperation.memo,
    });

    // 4. WayPoints 생성 및 저장
    if (createOperation.type === OperationType.REALTIME && createOperation.schedule.realTimeDispatchId) {
      // 실시간 배차인 경우 WayPoint 자동 생성
      await this.createRealTimeDispatchWayPoints(
        operation.id,
        createOperation.schedule.realTimeDispatchId,
        createOperation.schedule.isReverse,
      );
    } else {
      // 일반 예약인 경우 기존 로직 유지
      if (createOperation.schedule.wayPoints && createOperation.schedule.wayPoints.length > 0) {
        for (const wayPointInfo of createOperation.schedule.wayPoints) {
          await this.wayPointServiceInPort.create({
            operationId: operation.id,
            address: wayPointInfo.address,
            addressDetail: wayPointInfo.addressDetail,
            latitude: wayPointInfo.latitude,
            longitude: wayPointInfo.longitude,
            order: wayPointInfo.order,
          });
        }
      }
    }

    // 5. 실시간 배차인 경우 담당자 정보 저장
    if (createOperation.manager && createOperation.type === OperationType.REALTIME) {
    }
  }

  /**
   * 실시간 배차를 위한 WayPoint 자동 생성
   * @param operationId 운행 ID
   * @param realTimeDispatchId 실시간 배차 ID
   * @param isReverse 왕복 여부 (true: 왕복, false: 편도)
   */
  private async createRealTimeDispatchWayPoints(
    operationId: number,
    realTimeDispatchId: number,
    isReverse?: boolean,
  ): Promise<void> {
    try {
      // 실시간 배차 정보 조회
      const realTimeDispatch = await this.realTimeDispatchServiceOutPort.findById(realTimeDispatchId);
      if (!realTimeDispatch) throw new Error('실시간 배차 정보를 찾을 수 없습니다.');

      // 1. 출발지 WayPoint 생성 (order=1)
      await this.wayPointServiceInPort.create({
        operationId: operationId,
        name: realTimeDispatch.departureName,
        address: realTimeDispatch.departureAddress,
        addressDetail: realTimeDispatch.departureAddressDetail,
        order: 1,
      });

      // 2. 도착지 WayPoint 생성 (order=2)
      await this.wayPointServiceInPort.create({
        operationId: operationId,
        name: realTimeDispatch.destinationName,
        address: realTimeDispatch.destinationAddress,
        addressDetail: realTimeDispatch.destinationAddressDetail,
        order: 2,
      });

      // 3. 왕복인 경우 출발지로 돌아오는 WayPoint 추가 (order=3)
      if (isReverse) {
        await this.wayPointServiceInPort.create({
          operationId: operationId,
          name: realTimeDispatch.departureName,
          address: realTimeDispatch.departureAddress,
          addressDetail: realTimeDispatch.departureAddressDetail,
          order: 3,
        });
      }
    } catch (error) {
      console.error('Failed to create real-time dispatch waypoints:', error);
      throw new Error('실시간 배차 경유지 생성에 실패했습니다.');
    }
  }

  /**
   * 기존 실시간 배차 Operation에 WayPoint 자동 생성
   * @param operationId 운행 ID
   * @param isReverse 왕복 여부 (true: 왕복, false: 편도) - 기본값은 편도
   */
  async createMissingRealTimeDispatchWayPoints(operationId: number, isReverse: boolean = false): Promise<void> {
    try {
      const operation = await this.operationServiceOutPort.findById(operationId);
      if (!operation) throw new Error('운행 정보를 찾을 수 없습니다.');

      // 실시간 배차가 아니면 무시
      if (operation.type !== OperationType.REALTIME || !operation.realTimeDispatchId) {
        return;
      }

      // 이미 WayPoint가 있는지 확인
      const wayPointPagination = new PaginationQuery();
      wayPointPagination.page = 1;
      wayPointPagination.countPerPage = 10;

      const wayPoints = await this.wayPointServiceInPort.search({ operationId }, wayPointPagination);

      // WayPoint가 이미 있으면 무시
      if (wayPoints.data.length > 0) {
        return;
      }

      // WayPoint 생성
      await this.createRealTimeDispatchWayPoints(operationId, operation.realTimeDispatchId, isReverse);
    } catch (error) {
      console.error('Failed to create missing real-time dispatch waypoints:', error);
      throw new Error('실시간 배차 경유지 생성에 실패했습니다.');
    }
  }

  async update(id: number, updateOperation: UpdateOperationDto): Promise<void> {
    // 1. Operation 업데이트 실행
    await this.operationServiceOutPort.update(id, updateOperation);

    // 2. 영수증이나 추가비용이 업데이트되었는지 확인
    const hasReceiptUpdate = updateOperation.receiptImageUrls && updateOperation.receiptImageUrls.length > 0;
    const hasAdditionalCostsUpdate = updateOperation.additionalCosts && Object.keys(updateOperation.additionalCosts).length > 0;

    // 3. 영수증이나 추가비용이 업데이트된 경우, 기사 상태 확인 및 변경
    if (hasReceiptUpdate || hasAdditionalCostsUpdate) {
      const operation = await this.operationServiceOutPort.findById(id);
      if (!operation) throw new Error('운행 정보를 찾을 수 없습니다.');

      if (operation.chauffeurId) {
        const chauffeur = await this.chauffeurServiceOutPort.findById(operation.chauffeurId);
        if (!chauffeur) throw new Error('기사를 찾을 수 없습니다.');

        // 기사가 정보 미기입 상태인 경우 운행 완료 상태로 변경
        if (chauffeur.chauffeurStatus === ChauffeurStatus.PENDING_RECEIPT_INPUT) {
          await this.chauffeurServiceOutPort.update(operation.chauffeurId, {
            chauffeurStatus: ChauffeurStatus.OPERATION_COMPLETED,
          });
        }
      }
    }
  }

  async delete(id: number): Promise<void> {
    await this.operationServiceOutPort.updateStatus(id, DataStatus.DELETED);
  }

  async assignChauffeur(assignDto: AssignChauffeurDto): Promise<AssignChauffeurResponseDto> {
    // 1. 운행 정보 조회
    const operation = await this.operationServiceOutPort.findById(assignDto.operationId);
    if (!operation) throw new Error('운행 정보를 찾을 수 없습니다.');

    // 2. 새로 배정할 기사 정보 조회
    const newChauffeur = await this.chauffeurServiceOutPort.findById(assignDto.chauffeurId);
    if (!newChauffeur) throw new Error('기사를 찾을 수 없습니다.');

    // 3. 이전 기사 정보 저장 (있다면)
    let previousChauffeur = null;
    if (operation.chauffeurId) {
      previousChauffeur = await this.chauffeurServiceOutPort.findById(operation.chauffeurId);
    }

    // 4. 운행에 새로운 기사 배정
    await this.operationServiceOutPort.update(assignDto.operationId, {
      chauffeurId: assignDto.chauffeurId,
    });

    // 5. 응답 생성
    return plainToInstance(
      AssignChauffeurResponseDto,
      {
        operationId: assignDto.operationId,
        newChauffeurId: newChauffeur.id,
        newChauffeurName: newChauffeur.name,
        previousChauffeurId: previousChauffeur?.id || null,
        previousChauffeurName: previousChauffeur?.name || null,
        message: previousChauffeur
          ? `기사가 변경되었습니다. ${previousChauffeur.name} → ${newChauffeur.name}`
          : `기사가 배정되었습니다. ${newChauffeur.name}`,
      },
      classTransformDefaultOptions,
    );
  }
}
