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
import { ScheduleResponseDto } from '@/adapter/inbound/dto/response/schedule/schedule-response.dto';
import { Operation } from '@/domain/entity/operation.entity';
import { ChauffeurStatus } from '@/domain/enum/chauffeur-status.enum';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { OperationType } from '@/domain/enum/operation-type.enum';
import { OperationServiceInPort } from '@/port/inbound/operation-service.in-port';
import { ReservationServiceInPort } from '@/port/inbound/reservation-service.in-port';
import { ScheduleServiceInPort } from '@/port/inbound/schedule-service.in-port';
import { WayPointServiceInPort } from '@/port/inbound/way-point-service.in-port';
import { ChauffeurServiceOutPort } from '@/port/outbound/chauffeur-service.out-port';
import { GarageServiceOutPort } from '@/port/outbound/garage-service.out-port';
import { NotificationServiceOutPort } from '@/port/outbound/notification-service.out-port';
import { AdminServiceOutPort } from '@/port/outbound/admin-service.out-port';
import { OperationServiceOutPort } from '@/port/outbound/operation-service.out-port';
import { RealTimeDispatchServiceOutPort } from '@/port/outbound/real-time-dispatch-service.out-port';
import { ReservationServiceOutPort } from '@/port/outbound/reservation-service.out-port';
import { VehicleServiceOutPort } from '@/port/outbound/vehicle-service.out-port';
import { classTransformDefaultOptions } from '@/validate/serialization';
import { convertKstToUtc } from '@/util/date';
import {
  AdminOperationResponseDto,
  AdminWayPointInfoDto,
  ScheduleHistoryDto,
} from '@/adapter/inbound/dto/response/operation/admin-operation-response.dto';

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
    private readonly notificationServiceOutPort: NotificationServiceOutPort,
    private readonly scheduleServiceInPort: ScheduleServiceInPort,
    private readonly adminServiceOutPort: AdminServiceOutPort,
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
        const operationDto = plainToInstance(OperationResponseDto, operation);

        // 생성자 정보 조회
        try {
          const admin = await this.adminServiceOutPort.findById(operation.createdBy);
          if (admin) {
            operationDto.createdByName = admin.name;
          }
        } catch (error) {
          console.error(`Failed to fetch admin info for id ${operation.createdBy}:`, error);
        }

        // 기사 정보 조회
        if (operation.chauffeurId) {
          try {
            const chauffeur = await this.chauffeurServiceOutPort.findById(operation.chauffeurId);
            if (chauffeur) {
              operationDto.chauffeur = plainToInstance(ChauffeurInfoDto, {
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
              });
            }
          } catch {
            // 기사 정보를 찾을 수 없는 경우
            operationDto.chauffeur = null;
          }
        }

        // 차량 정보 조회
        if (operation.vehicleId) {
          try {
            const vehicle = await this.vehicleServiceOutPort.findById(operation.vehicleId);
            if (vehicle) {
              operationDto.vehicle = plainToInstance(VehicleInfoDto, {
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
              });

              // 차고지 정보 조회
              if (vehicle.garageId) {
                try {
                  const garage = await this.garageServiceOutPort.findById(vehicle.garageId);
                  if (garage) {
                    operationDto.garage = plainToInstance(GarageInfoDto, {
                      id: garage.id,
                      name: garage.name,
                      address: garage.address,
                      addressDetail: garage.detailAddress,
                      status: garage.status,
                      createdBy: garage.createdBy,
                      createdAt: garage.createdAt,
                      updatedBy: garage.updatedBy,
                      updatedAt: garage.updatedAt,
                    });
                  }
                } catch {
                  operationDto.garage = null;
                }
              }
            }
          } catch {
            operationDto.vehicle = null;
          }
        }

        // 실시간 배차 정보 조회
        if (operation.realTimeDispatchId) {
          try {
            const realTimeDispatch = await this.realTimeDispatchServiceOutPort.findById(operation.realTimeDispatchId);
            if (realTimeDispatch) {
              operationDto.realTimeDispatch = plainToInstance(RealTimeDispatchInfoDto, {
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
              });
            }
          } catch {
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
            operationDto.reservation = plainToInstance(ReservationInfoDto, {
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
            });
          }
        } catch {
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
              plainToInstance(WayPointInfoDto, {
                id: wp.id,
                operationId: wp.operationId,
                name: wp.name,
                address: wp.address,
                addressDetail: wp.addressDetail,
                chauffeurStatus: wp.chauffeurStatus,
                latitude: wp.latitude,
                longitude: wp.longitude,
                visitTime: wp.visitTime,
                scheduledTime: wp.scheduledTime,
                order: wp.order,
                status: wp.status,
                createdBy: wp.createdBy,
                createdAt: wp.createdAt,
                updatedBy: wp.updatedBy,
                updatedAt: wp.updatedAt,
              }),
            );
        } catch {
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
    const operationDto = plainToInstance(OperationResponseDto, operation);

    // 기사, 차량, 실시간 배차, 예약, 경유지 정보 매핑 (위와 동일한 로직을 반복)
    // 기사 정보 조회
    if (operation.chauffeurId) {
      try {
        const chauffeur = await this.chauffeurServiceOutPort.findById(operation.chauffeurId);
        if (chauffeur) {
          operationDto.chauffeur = plainToInstance(ChauffeurInfoDto, {
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
          });
        }
      } catch {
        // 기사 정보를 찾을 수 없는 경우
        operationDto.chauffeur = null;
      }
    }

    // 차량 정보 조회
    if (operation.vehicleId) {
      try {
        const vehicle = await this.vehicleServiceOutPort.findById(operation.vehicleId);
        if (vehicle) {
          operationDto.vehicle = plainToInstance(VehicleInfoDto, {
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
          });

          // 차고지 정보 조회
          if (vehicle.garageId) {
            try {
              const garage = await this.garageServiceOutPort.findById(vehicle.garageId);
              if (garage) {
                operationDto.garage = plainToInstance(GarageInfoDto, {
                  id: garage.id,
                  name: garage.name,
                  address: garage.address,
                  addressDetail: garage.detailAddress,
                  status: garage.status,
                  createdBy: garage.createdBy,
                  createdAt: garage.createdAt,
                  updatedBy: garage.updatedBy,
                  updatedAt: garage.updatedAt,
                });
              }
            } catch {
              operationDto.garage = null;
            }
          }
        }
      } catch {
        operationDto.vehicle = null;
      }
    }

    // 실시간 배차 정보 조회
    if (operation.realTimeDispatchId) {
      try {
        const realTimeDispatch = await this.realTimeDispatchServiceOutPort.findById(operation.realTimeDispatchId);
        if (realTimeDispatch) {
          operationDto.realTimeDispatch = plainToInstance(RealTimeDispatchInfoDto, {
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
          });
        }
      } catch {
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
        operationDto.reservation = plainToInstance(ReservationInfoDto, {
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
        });
      }
    } catch {
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
          plainToInstance(WayPointInfoDto, {
            id: wp.id,
            operationId: wp.operationId,
            name: wp.name,
            address: wp.address,
            addressDetail: wp.addressDetail,
            chauffeurStatus: wp.chauffeurStatus,
            latitude: wp.latitude,
            longitude: wp.longitude,
            visitTime: wp.visitTime,
            scheduledTime: wp.scheduledTime,
            order: wp.order,
            status: wp.status,
            createdBy: wp.createdBy,
            createdAt: wp.createdAt,
            updatedBy: wp.updatedBy,
            updatedAt: wp.updatedAt,
          }),
        );
    } catch {
      operationDto.wayPoints = [];
    }

    return operationDto;
  }

  /**
   * 관리자용 운행 상세 조회 - waypoint 진행 상태 포함
   */
  async getAdminOperationDetail(id: number): Promise<AdminOperationResponseDto> {
    const operationDetail = await this.operationServiceOutPort.findByIdWithDetails(id);
    if (!operationDetail) throw new Error('운행 정보를 찾을 수 없습니다.');

    // 기본 응답 구성 (기존 OperationResponseDto와 동일한 정보)
    const response = new AdminOperationResponseDto();
    response.id = operationDetail.id;
    response.type = operationDetail.type;
    response.isRepeated = operationDetail.isRepeated;
    response.startTime = operationDetail.startTime;
    response.endTime = operationDetail.endTime;
    response.distance = operationDetail.distance;
    response.chauffeurId = operationDetail.chauffeurId;
    response.chauffeurName = (operationDetail as any)?.chauffeurName || null;
    response.chauffeurPhone = (operationDetail as any)?.chauffeurPhone || null;
    response.passengerCount = (operationDetail as any)?.passengerCount || null;
    response.vehicleId = operationDetail.vehicleId;
    response.realTimeDispatchId = operationDetail.realTimeDispatchId;
    response.managerName = operationDetail.managerName;
    response.managerNumber = operationDetail.managerNumber;
    response.additionalCosts = operationDetail.additionalCosts;
    response.receiptImageUrls = operationDetail.receiptImageUrls;
    response.kakaoPath = operationDetail.kakaoPath;
    response.status = operationDetail.status;
    response.createdBy = operationDetail.createdBy;
    response.createdAt = operationDetail.createdAt;
    response.updatedBy = operationDetail.updatedBy;
    response.updatedAt = operationDetail.updatedAt;

    // 생성자 정보 조회
    try {
      const admin = await this.adminServiceOutPort.findById(operationDetail.createdBy);
      response.createdByName = admin ? admin.name : null;
    } catch (error) {
      console.error(`Failed to fetch admin info for id ${operationDetail.createdBy}:`, error);
      response.createdByName = null;
    }

    // 관련 엔티티 정보 별도 조회 및 설정
    // 1. 기사 정보 조회
    if (operationDetail.chauffeurId) {
      try {
        response.chauffeur = await this.chauffeurServiceOutPort.findById(operationDetail.chauffeurId);
      } catch {
        response.chauffeur = null;
      }
    } else {
      response.chauffeur = null;
    }

    // 2. 차량 정보 조회
    if (operationDetail.vehicleId) {
      try {
        response.vehicle = await this.vehicleServiceOutPort.findById(operationDetail.vehicleId);
      } catch {
        response.vehicle = null;
      }
    } else {
      response.vehicle = null;
    }

    // 3. 차고지 정보 조회 (차량이 있는 경우)
    if ((response.vehicle as any)?.garageId) {
      try {
        const garage = await this.garageServiceOutPort.findById((response.vehicle as any).garageId);
        if (garage) {
          response.garage = plainToInstance(GarageInfoDto, {
            id: garage.id,
            name: garage.name,
            address: garage.address,
            addressDetail: garage.detailAddress,
            status: garage.status,
            createdBy: garage.createdBy,
            createdAt: garage.createdAt,
            updatedBy: garage.updatedBy,
            updatedAt: garage.updatedAt,
          });
        } else {
          response.garage = null;
        }
      } catch {
        response.garage = null;
      }
    } else {
      response.garage = null;
    }

    // 4. 실시간 배차 정보 조회
    if (operationDetail.realTimeDispatchId) {
      try {
        response.realTimeDispatch = await this.realTimeDispatchServiceOutPort.findById(operationDetail.realTimeDispatchId);
      } catch {
        response.realTimeDispatch = null;
      }
    } else {
      response.realTimeDispatch = null;
    }

    // 5. 예약 정보 조회
    try {
      response.reservation = await this.reservationServiceOutPort.findByOperationId(operationDetail.id);
    } catch {
      response.reservation = null;
    }

    // 6. Schedule 정보 조회 및 wayPoint와 조합
    try {
      response.schedules = await this.buildScheduleHistory(operationDetail.id);
    } catch {
      response.schedules = [];
    }

    // 기사의 현재 상태 조회 (진행상태 계산을 위해)
    let chauffeurStatus: ChauffeurStatus | null = null;
    if (response.chauffeur) {
      chauffeurStatus = (response.chauffeur as any).chauffeurStatus;
    }

    // 7. WayPoint 정보 조회 및 진행 상태 계산
    try {
      const wayPointPagination = new PaginationQuery();
      wayPointPagination.page = 1;
      wayPointPagination.countPerPage = 100;

      const wayPointsResponse = await this.wayPointServiceInPort.search({ operationId: operationDetail.id }, wayPointPagination);

      const sortedWayPoints = wayPointsResponse.data.sort((a: any, b: any) => a.order - b.order);
      response.wayPoints = sortedWayPoints.map((wp: unknown) =>
        this.calculateWayPointProgress(wp, chauffeurStatus, sortedWayPoints),
      );
    } catch {
      response.wayPoints = [];
    }

    return response;
  }

  /**
   * WayPoint의 진행 상태 계산
   */
  private calculateWayPointProgress(
    wayPoint: any,
    chauffeurStatus: ChauffeurStatus | null,
    allWayPoints: any[],
  ): AdminWayPointInfoDto {
    const adminWayPoint = new AdminWayPointInfoDto();
    adminWayPoint.id = wayPoint.id;
    adminWayPoint.name = wayPoint.name;
    adminWayPoint.address = wayPoint.address;
    adminWayPoint.addressDetail = wayPoint.addressDetail;
    adminWayPoint.order = wayPoint.order;
    adminWayPoint.visitTime = wayPoint.visitTime;
    adminWayPoint.scheduledTime = wayPoint.scheduledTime;
    adminWayPoint.chauffeurStatus = wayPoint.chauffeurStatus;

    // 전체 운행의 현재 상태에 따른 각 wayPoint별 진행 상태 계산
    const progressData = this.calculateDetailedWayPointStatus(wayPoint, chauffeurStatus, allWayPoints);
    adminWayPoint.progressStatus = progressData.status;
    adminWayPoint.progressLabel = progressData.label;
    adminWayPoint.progressLabelStatus = progressData.chauffeurStatus;

    return adminWayPoint;
  }

  /**
   * 상세한 wayPoint 진행 상태 계산
   * 출발지이동 → 탑승대기 → 운행시작 → 운행종료 단계별로 표시
   */
  private calculateDetailedWayPointStatus(
    wayPoint: any,
    chauffeurStatus: ChauffeurStatus | null,
    allWayPoints: any[],
  ): { status: string; label: string; chauffeurStatus: ChauffeurStatus | null } {
    const isFirstWayPoint = wayPoint?.order === 1;
    const isLastWayPoint = wayPoint?.order === allWayPoints.length;
    const hasVisited = wayPoint?.visitTime != null;

    // 이미 방문 완료된 wayPoint
    if (hasVisited) {
      if (isLastWayPoint) {
        return { status: 'COMPLETED', label: '운행종료', chauffeurStatus: wayPoint?.chauffeurStatus };
      } else {
        // 중간 wayPoint 방문 완료
        return { status: 'COMPLETED', label: '완료', chauffeurStatus: wayPoint?.chauffeurStatus };
      }
    }

    // 현재 진행 중인 상태에 따른 계산
    if (!chauffeurStatus) {
      return { status: 'PENDING', label: '대기', chauffeurStatus: null };
    }

    switch (chauffeurStatus) {
      case ChauffeurStatus.MOVING_TO_DEPARTURE:
        if (isFirstWayPoint) {
          return { status: 'IN_PROGRESS', label: '출발지이동', chauffeurStatus: ChauffeurStatus.MOVING_TO_DEPARTURE };
        }
        return { status: 'PENDING', label: '대기', chauffeurStatus: null };

      case ChauffeurStatus.WAITING_FOR_PASSENGER:
        if (isFirstWayPoint) {
          return { status: 'IN_PROGRESS', label: '탑승대기', chauffeurStatus: ChauffeurStatus.WAITING_FOR_PASSENGER };
        }
        return { status: 'PENDING', label: '대기', chauffeurStatus: null };

      case ChauffeurStatus.IN_OPERATION:
        // 다음 방문할 wayPoint 찾기
        const nextWayPoint = this.findNextWayPoint(allWayPoints);
        if (nextWayPoint && (nextWayPoint as any)?.id === wayPoint?.id) {
          return { status: 'IN_PROGRESS', label: '운행시작', chauffeurStatus: ChauffeurStatus.IN_OPERATION };
        }
        // 이미 방문한 wayPoint들 중에서 현재 위치
        const currentWayPoint = this.findCurrentWayPointDuringOperation(wayPoint, allWayPoints);
        if (currentWayPoint) {
          return { status: 'IN_PROGRESS', label: '운행중', chauffeurStatus: ChauffeurStatus.IN_OPERATION };
        }
        return { status: 'PENDING', label: '대기', chauffeurStatus: null };

      case ChauffeurStatus.WAITING_OPERATION:
        // 가장 최근에 방문한 wayPoint
        const lastVisitedWayPoint = this.findLastVisitedWayPoint(allWayPoints);
        if (lastVisitedWayPoint && (lastVisitedWayPoint as any)?.id === wayPoint?.id) {
          if (isLastWayPoint) {
            return { status: 'IN_PROGRESS', label: '운행종료 대기', chauffeurStatus: ChauffeurStatus.WAITING_OPERATION };
          }
          return { status: 'IN_PROGRESS', label: '운행대기', chauffeurStatus: ChauffeurStatus.WAITING_OPERATION };
        }
        return { status: 'PENDING', label: '대기', chauffeurStatus: null };

      case ChauffeurStatus.OPERATION_COMPLETED:
        if (isLastWayPoint) {
          return { status: 'COMPLETED', label: '운행종료', chauffeurStatus: ChauffeurStatus.OPERATION_COMPLETED };
        }
        return { status: 'COMPLETED', label: '완료', chauffeurStatus: wayPoint?.chauffeurStatus };

      default:
        return { status: 'PENDING', label: '대기', chauffeurStatus: null };
    }
  }

  /**
   * 다음 방문할 wayPoint 찾기
   */
  private findNextWayPoint(allWayPoints: any[]): any | null {
    return allWayPoints.find((wp) => !(wp as any)?.visitTime) || null;
  }

  /**
   * 운행 중 현재 wayPoint인지 확인
   */
  private findCurrentWayPointDuringOperation(wayPoint: any, allWayPoints: any[]): boolean {
    const visitedWayPoints = allWayPoints.filter((wp) => (wp as any)?.visitTime);
    const unvisitedWayPoints = allWayPoints.filter((wp) => !(wp as any)?.visitTime);

    // 미방문 wayPoint 중 첫 번째가 현재 진행 중인 wayPoint
    if (unvisitedWayPoints.length > 0) {
      return (unvisitedWayPoints[0] as any)?.id === wayPoint?.id;
    }
    return false;
  }

  /**
   * 가장 최근에 방문한 wayPoint 찾기
   */
  private findLastVisitedWayPoint(allWayPoints: any[]): any | null {
    const visitedWayPoints = allWayPoints
      .filter((wp) => (wp as any)?.visitTime)
      .sort((a, b) => new Date((b as any)?.visitTime).getTime() - new Date((a as any)?.visitTime).getTime());

    return visitedWayPoints.length > 0 ? visitedWayPoints[0] : null;
  }

  async create(createOperation: CreateOperationDto): Promise<void> {
    // 1. Operation 엔티티 생성
    const operation = plainToInstance(Operation, {
      type: createOperation.type,
      isRepeated: createOperation.schedule.isRepeat || false,
      startTime: createOperation.startTime ? convertKstToUtc(createOperation.startTime) : null,
      endTime: createOperation.endTime ? convertKstToUtc(createOperation.endTime) : null,
      chauffeurId: createOperation.chauffeurId,
      vehicleId: createOperation.vehicleId,
      realTimeDispatchId: createOperation.schedule.realTimeDispatchId,
      managerName: createOperation.manager?.managerName || null,
      managerNumber: createOperation.manager?.managerNumber || null,
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
          // date와 time을 scheduledTime으로 변환
          let scheduledTime: string | undefined = undefined;
          if (wayPointInfo.date && wayPointInfo.time) {
            scheduledTime = `${wayPointInfo.date}T${wayPointInfo.time}:00`;
          }

          await this.wayPointServiceInPort.create({
            operationId: operation.id,
            address: wayPointInfo.address,
            addressDetail: wayPointInfo.addressDetail,
            latitude: wayPointInfo.latitude,
            longitude: wayPointInfo.longitude,
            scheduledTime: scheduledTime,
            order: wayPointInfo.order,
          });
        }
      }
    }

    // 5. 실시간 배차인 경우 담당자 정보는 이미 operation에 저장됨
    console.log('Operation created successfully with manager info:', {
      operationId: operation.id,
      managerName: operation.managerName,
      managerNumber: operation.managerNumber,
    });
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

      // isReverse가 true인 경우 출발지와 도착지를 바꿔서 생성
      const firstWayPoint = isReverse
        ? {
            name: realTimeDispatch.destinationName,
            address: realTimeDispatch.destinationAddress,
            addressDetail: realTimeDispatch.destinationAddressDetail,
          }
        : {
            name: realTimeDispatch.departureName,
            address: realTimeDispatch.departureAddress,
            addressDetail: realTimeDispatch.departureAddressDetail,
          };

      const secondWayPoint = isReverse
        ? {
            name: realTimeDispatch.departureName,
            address: realTimeDispatch.departureAddress,
            addressDetail: realTimeDispatch.departureAddressDetail,
          }
        : {
            name: realTimeDispatch.destinationName,
            address: realTimeDispatch.destinationAddress,
            addressDetail: realTimeDispatch.destinationAddressDetail,
          };

      // 1. 첫 번째 WayPoint 생성 (order=1)
      await this.wayPointServiceInPort.create({
        operationId: operationId,
        name: firstWayPoint.name,
        address: firstWayPoint.address,
        addressDetail: firstWayPoint.addressDetail,
        order: 1,
      });

      // 2. 두 번째 WayPoint 생성 (order=2)
      await this.wayPointServiceInPort.create({
        operationId: operationId,
        name: secondWayPoint.name,
        address: secondWayPoint.address,
        addressDetail: secondWayPoint.addressDetail,
        order: 2,
      });

      // 3. isReverse가 true인 경우 원래 출발지로 돌아오는 WayPoint 추가 (order=3)
      if (isReverse) {
        await this.wayPointServiceInPort.create({
          operationId: operationId,
          name: firstWayPoint.name,
          address: firstWayPoint.address,
          addressDetail: firstWayPoint.addressDetail,
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
    console.log('=== Operation Update Debug ===');
    console.log('ID:', id);
    console.log('Update Data:', JSON.stringify(updateOperation, null, 2));
    console.log('Distance:', updateOperation.distance);
    console.log('Additional Costs:', updateOperation.additionalCosts);
    console.log('Receipt Image URLs:', updateOperation.receiptImageUrls);

    // undefined 값만 제거 (null 값은 유지하여 DB에서 필드를 null로 설정할 수 있도록 함)
    const filteredUpdate = Object.fromEntries(Object.entries(updateOperation).filter(([_, value]) => value !== undefined));

    console.log('Filtered Update Data:', JSON.stringify(filteredUpdate, null, 2));

    await this.operationServiceOutPort.update(id, filteredUpdate);

    // 영수증 또는 추가비용 입력 시 자동 상태 전환 체크
    await this.checkAndTransitionChauffeurStatus(id, updateOperation);

    // wayPoints 수정이 포함된 경우 처리
    if (updateOperation.wayPoints) {
      await this.updateWayPointsWithOrderReordering(id, updateOperation.wayPoints);
    }
  }

  async updateAdmin(id: number, updateOperation: UpdateOperationDto): Promise<void> {
    // 관리자용 운행 수정 - 일정 로그 수정 포함
    // undefined 값만 제거 (null 값은 유지하여 DB에서 필드를 null로 설정할 수 있도록 함)
    const filteredUpdate = Object.fromEntries(Object.entries(updateOperation).filter(([_, value]) => value !== undefined));

    await this.operationServiceOutPort.update(id, filteredUpdate);

    // 영수증 또는 추가비용 입력 시 자동 상태 전환 체크
    await this.checkAndTransitionChauffeurStatus(id, updateOperation);

    // wayPoints 수정이 포함된 경우 처리
    if (updateOperation.wayPoints) {
      await this.updateWayPointsWithOrderReordering(id, updateOperation.wayPoints);
    }
  }

  async delete(id: number): Promise<void> {
    // 1. 운행 정보 조회 (취소 알림 전송을 위해)
    const operation = await this.operationServiceOutPort.findById(id);
    if (!operation) {
      throw new Error('운행 정보를 찾을 수 없습니다.');
    }

    // 2. 기사가 배정되어 있다면 취소 알림 전송
    if (operation.chauffeurId) {
      try {
        await this.notificationServiceOutPort.sendOperationCancellationNotification(
          operation.chauffeurId,
          id,
          '운행이 취소되었습니다.',
        );
      } catch (error) {
        console.error('FCM 취소 알림 전송 실패:', error);
        // 알림 전송 실패해도 취소는 진행
      }
    }

    // 3. 운행 상태를 DELETED로 변경
    await this.operationServiceOutPort.updateStatus(id, DataStatus.DELETED);
  }

  async cancel(id: number, reason?: string): Promise<void> {
    // 1. 운행 정보 조회 (취소 알림 전송을 위해)
    const operation = await this.operationServiceOutPort.findById(id);
    if (!operation) {
      throw new Error('운행 정보를 찾을 수 없습니다.');
    }

    // 2. 기사가 배정되어 있다면 취소 알림 전송
    if (operation.chauffeurId) {
      try {
        await this.notificationServiceOutPort.sendOperationCancellationNotification(
          operation.chauffeurId,
          id,
          reason || '운행이 취소되었습니다.',
        );
      } catch (error) {
        console.error('FCM 취소 알림 전송 실패:', error);
        // 알림 전송 실패해도 취소는 진행
      }
    }

    // 3. 운행 상태를 CANCELLED로 변경
    await this.operationServiceOutPort.updateStatus(id, DataStatus.CANCELLED);
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

    // 4. 기존 기사가 있다면 취소 알림 전송 (기사 변경인 경우)
    if (previousChauffeur) {
      try {
        await this.notificationServiceOutPort.sendOperationCancellationNotification(
          previousChauffeur.id,
          assignDto.operationId,
          '배정된 운행이 다른 기사로 변경되었습니다.',
        );
      } catch (error) {
        console.error('기존 기사 FCM 취소 알림 전송 실패:', error);
        // 알림 전송 실패해도 배정은 진행
      }
    }

    // 5. 운행에 새로운 기사 배정 (기사의 차량도 함께 배정)
    await this.operationServiceOutPort.update(assignDto.operationId, {
      chauffeurId: assignDto.chauffeurId,
      vehicleId: newChauffeur.vehicleId,
    });

    // 6. 새로운 기사에게 FCM 배정 알림 전송 (항상 전송)
    try {
      const notificationMessage = `새로운 운행이 배정되었습니다. 출발시간: ${operation.startTime ? new Date(operation.startTime).toLocaleString('ko-KR') : '미정'}`;
      await this.notificationServiceOutPort.sendReservationNotification(
        assignDto.chauffeurId,
        assignDto.operationId,
        notificationMessage,
      );
    } catch (error) {
      console.error('FCM 알림 전송 실패:', error);
      // 알림 전송 실패해도 배정은 성공으로 처리
    }

    // 7. 응답 생성
    return plainToInstance(AssignChauffeurResponseDto, {
      operationId: assignDto.operationId,
      newChauffeurId: newChauffeur.id,
      newChauffeurName: newChauffeur.name,
      previousChauffeurId: previousChauffeur?.id || null,
      previousChauffeurName: previousChauffeur?.name || null,
      message: previousChauffeur
        ? `기사가 변경되었습니다. ${previousChauffeur.name} → ${newChauffeur.name}`
        : `기사가 배정되었습니다. ${newChauffeur.name}`,
    });
  }

  /**
   * wayPoints 덮어씌우기 방식 업데이트
   */
  private async updateWayPointsWithOrderReordering(operationId: number, wayPoints: any[]): Promise<void> {
    try {
      // 1. 기존 wayPoints 조회
      const wayPointPagination = new PaginationQuery();
      wayPointPagination.page = 1;
      wayPointPagination.countPerPage = 100;
      const existingWayPoints = await this.wayPointServiceInPort.search({ operationId }, wayPointPagination);
      
      // 2. 요청으로 들어온 wayPoint들의 ID 수집
      const requestWayPointIds = wayPoints.filter(wp => wp.id).map(wp => wp.id);
      
      // 3. 요청에 없는 기존 wayPoint들 삭제 (hard delete)
      for (const existingWp of existingWayPoints.data) {
        if (!requestWayPointIds.includes(existingWp.id)) {
          await this.wayPointServiceInPort.hardDelete(existingWp.id);
        }
      }
      
      // 4. wayPoint 생성/업데이트 처리
      for (const wayPoint of wayPoints) {
        if (wayPoint.id) {
          // ID가 있으면 업데이트
          await this.wayPointServiceInPort.update(wayPoint.id, {
            operationId,
            name: wayPoint.name,
            address: wayPoint.address,
            addressDetail: wayPoint.addressDetail,
            latitude: wayPoint.latitude,
            longitude: wayPoint.longitude,
            visitTime: wayPoint.visitTime,
            scheduledTime: wayPoint.scheduledTime,
            order: wayPoint.order,
          });
        } else {
          // ID가 없으면 생성
          await this.wayPointServiceInPort.create({
            operationId,
            name: wayPoint.name,
            address: wayPoint.address,
            addressDetail: wayPoint.addressDetail,
            latitude: wayPoint.latitude,
            longitude: wayPoint.longitude,
            visitTime: wayPoint.visitTime,
            scheduledTime: wayPoint.scheduledTime,
            order: wayPoint.order,
          });
        }
      }
    } catch (error) {
      console.error('wayPoints 덮어씌우기 업데이트 중 오류 발생:', error);
      throw new Error('wayPoints 업데이트에 실패했습니다.');
    }
  }


  /**
   * 영수증 또는 추가비용 입력 시 기사 상태 자동 전환 체크
   */
  private async checkAndTransitionChauffeurStatus(operationId: number, updateOperation: UpdateOperationDto): Promise<void> {
    // 영수증 이미지 또는 추가비용이 입력되었는지 확인
    const hasReceiptOrCosts = updateOperation.receiptImageUrls || updateOperation.additionalCosts;

    if (!hasReceiptOrCosts) {
      return; // 영수증이나 추가비용 업데이트가 없으면 리턴
    }

    try {
      // 해당 운행의 기사 ID 조회
      const operation = await this.operationServiceOutPort.findById(operationId);
      if (!operation?.chauffeurId) {
        return; // 기사가 배정되지 않은 운행이면 리턴
      }

      // 기사의 현재 상태 조회
      const chauffeur = await this.chauffeurServiceOutPort.findById(operation.chauffeurId);
      if (!chauffeur || chauffeur.chauffeurStatus !== ChauffeurStatus.PENDING_RECEIPT_INPUT) {
        return; // 기사가 PENDING_RECEIPT_INPUT 상태가 아니면 리턴
      }

      console.log(`=== Auto transition chauffeur status ===`);
      console.log(`Operation ID: ${operationId}, Chauffeur ID: ${operation.chauffeurId}`);
      console.log(`Current chauffeur status: ${chauffeur.chauffeurStatus}`);

      // 기사 상태를 OPERATION_COMPLETED로 자동 전환
      await this.chauffeurServiceOutPort.update(operation.chauffeurId, {
        chauffeurStatus: ChauffeurStatus.OPERATION_COMPLETED,
      });

      console.log(`Chauffeur status updated to OPERATION_COMPLETED`);

      // 운행 상태도 COMPLETED로 변경
      await this.operationServiceOutPort.update(operationId, {
        status: DataStatus.COMPLETED,
      });

      console.log(`Operation status updated to COMPLETED`);
    } catch (error) {
      console.error('기사 상태 자동 전환 중 오류 발생:', error);
      // 에러가 발생해도 operation 업데이트는 성공했으므로 예외를 던지지 않음
    }
  }

  /**
   * Schedule 정보와 WayPoint 정보를 조합하여 운행 이력을 생성합니다.
   */
  private async buildScheduleHistory(operationId: number): Promise<ScheduleHistoryDto[]> {
    const scheduleHistory: ScheduleHistoryDto[] = [];

    try {
      // 1. 해당 운행의 Schedule 기록들 조회
      const schedules = await this.scheduleServiceInPort.findByOperationId(operationId);

      // 2. 각 Schedule 기록에 대해 wayPoint 정보와 조합
      for (const schedule of schedules) {
        if (schedule.wayPointId) {
          try {
            // wayPoint 정보 조회
            const wayPointPagination = new PaginationQuery();
            wayPointPagination.page = 1;
            wayPointPagination.countPerPage = 1;

            const wayPointsResponse = await this.wayPointServiceInPort.search({ operationId: operationId }, wayPointPagination);

            // 해당 wayPoint 찾기
            const wayPoint = wayPointsResponse.data.find((wp) => wp.id === schedule.wayPointId);

            if (wayPoint) {
              const historyItem = plainToInstance(ScheduleHistoryDto, {
                id: wayPoint.id,
                name: wayPoint.name,
                address: wayPoint.address,
                addressDetail: wayPoint.addressDetail,
                order: wayPoint.order,
                visitTime: schedule.visitTime,
                scheduledTime: wayPoint.scheduledTime,
                progressLabelStatus: this.getProgressLabelFromStatus(schedule.chauffeurStatus),
              });

              scheduleHistory.push(historyItem);
            }
          } catch (error) {
            console.error(`Failed to process schedule ${schedule.id}:`, error);
          }
        }
      }

      // 3. 기록 시간순으로 정렬
      scheduleHistory.sort((a, b) => new Date(a.visitTime).getTime() - new Date(b.visitTime).getTime());
    } catch (error) {
      console.error('Failed to build schedule history:', error);
    }

    return scheduleHistory;
  }

  /**
   * ChauffeurStatus를 기반으로 진행 상태 라벨을 생성합니다.
   */
  private getProgressLabelFromStatus(chauffeurStatus: ChauffeurStatus): string {
    switch (chauffeurStatus) {
      case ChauffeurStatus.MOVING_TO_DEPARTURE:
        return '출발지 이동';
      case ChauffeurStatus.WAITING_FOR_PASSENGER:
        return '탑승 대기';
      case ChauffeurStatus.IN_OPERATION:
        return '운행 시작';
      case ChauffeurStatus.WAITING_OPERATION:
        return '운행 종료';
      case ChauffeurStatus.OPERATION_COMPLETED:
        return '운행 완료';
      default:
        return '알 수 없음';
    }
  }
}
