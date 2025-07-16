import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { Pagination, PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { ChangeChauffeurStatusDto } from '@/adapter/inbound/dto/request/chauffeur/change-status.dto';
import { CreateChauffeurDto } from '@/adapter/inbound/dto/request/chauffeur/create-chauffeur.dto';
import { SearchChauffeurDto } from '@/adapter/inbound/dto/request/chauffeur/search-chauffeur.dto';
import { UpdateChauffeurDto } from '@/adapter/inbound/dto/request/chauffeur/update-chauffeur.dto';
import { UpdateLocationDto } from '@/adapter/inbound/dto/request/chauffeur/update-location.dto';
import { AssignedVehicleResponseDto } from '@/adapter/inbound/dto/response/chauffeur/assigned-vehicle-response.dto';
import { ChauffeurProfileResponseDto } from '@/adapter/inbound/dto/response/chauffeur/chauffeur-profile-response.dto';
import {
  ChauffeurResponseDto,
  VehicleInfoDto,
  GarageInfoDto,
} from '@/adapter/inbound/dto/response/chauffeur/chauffeur-response.dto';
import {
  CurrentOperationResponseDto,
  CurrentReservationDto,
  CurrentWayPointDto,
} from '@/adapter/inbound/dto/response/chauffeur/current-operation-response.dto';
import { LocationResponseDto } from '@/adapter/inbound/dto/response/chauffeur/location-response.dto';
import {
  NearestReservationResponseDto,
  NextOperationDto,
  NextReservationDto,
  NextWayPointDto,
} from '@/adapter/inbound/dto/response/chauffeur/nearest-reservation-response.dto';
import {
  ChauffeurStatusChangeResponseDto,
  WayPointInfo,
} from '@/adapter/inbound/dto/response/chauffeur/status-change-response.dto';
import { Chauffeur } from '@/domain/entity/chauffeur.entity';
import { ChauffeurStatus } from '@/domain/enum/chauffeur-status.enum';
import { ChauffeurType } from '@/domain/enum/chauffeur-type.enum';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { OperationType } from '@/domain/enum/operation-type.enum';
import { ChauffeurServiceInPort } from '@/port/inbound/chauffeur-service.in-port';
import { ReservationServiceInPort } from '@/port/inbound/reservation-service.in-port';
import { WayPointServiceInPort } from '@/port/inbound/way-point-service.in-port';
import { ChauffeurServiceOutPort } from '@/port/outbound/chauffeur-service.out-port';
import { GarageServiceOutPort } from '@/port/outbound/garage-service.out-port';
import { OperationServiceOutPort } from '@/port/outbound/operation-service.out-port';
import { RealTimeDispatchServiceOutPort } from '@/port/outbound/real-time-dispatch-service.out-port';
import { VehicleServiceOutPort } from '@/port/outbound/vehicle-service.out-port';
import { WayPointServiceOutPort } from '@/port/outbound/way-point-service.out-port';
import { WorkHistoryService } from '@/port/service/work-history.service';
import { classTransformDefaultOptions } from '@/validate/serialization';

@Injectable()
export class ChauffeurService implements ChauffeurServiceInPort {
  constructor(
    private readonly chauffeurServiceOutPort: ChauffeurServiceOutPort,
    private readonly operationServiceOutPort: OperationServiceOutPort,
    private readonly vehicleServiceOutPort: VehicleServiceOutPort,
    private readonly realTimeDispatchServiceOutPort: RealTimeDispatchServiceOutPort,
    private readonly reservationServiceInPort: ReservationServiceInPort,
    private readonly wayPointServiceInPort: WayPointServiceInPort,
    private readonly wayPointServiceOutPort: WayPointServiceOutPort,
    private readonly workHistoryService: WorkHistoryService,
    private readonly garageServiceOutPort: GarageServiceOutPort,
  ) {}

  async search(
    searchChauffeur: SearchChauffeurDto,
    paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<ChauffeurResponseDto>> {
    const [chauffeurs, totalCount] = await this.chauffeurServiceOutPort.findAll(
      searchChauffeur,
      paginationQuery,
      DataStatus.DELETED,
    );
    const pagination = new Pagination({ totalCount, paginationQuery });

    // 각 기사에 대해 관련 데이터를 조회하고 매핑
    const chauffeurDtos = await Promise.all(
      chauffeurs.map(async (chauffeur) => {
        const chauffeurDto = plainToInstance(ChauffeurResponseDto, chauffeur, classTransformDefaultOptions);

        // 차량 정보 조회
        if (chauffeur.vehicleId) {
          try {
            const vehicle = await this.vehicleServiceOutPort.findById(chauffeur.vehicleId);
            if (vehicle) {
              chauffeurDto.vehicle = plainToInstance(
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

              // 차고지 정보 조회 (차량이 있는 경우)
              if (vehicle.garageId) {
                try {
                  const garage = await this.garageServiceOutPort.findById(vehicle.garageId);
                  if (garage) {
                    chauffeurDto.garage = plainToInstance(
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
                } catch {
                  chauffeurDto.garage = null;
                }
              }
            }
          } catch {
            chauffeurDto.vehicle = null;
          }
        }

        return chauffeurDto;
      }),
    );

    return new PaginationResponse(chauffeurDtos, pagination);
  }

  async detail(id: number): Promise<ChauffeurResponseDto> {
    const chauffeur = await this.chauffeurServiceOutPort.findById(id);
    if (!chauffeur) throw new Error('기사를 찾을 수 없습니다.');

    // 삭제된 쇼퍼인 경우 예외 처리
    if (chauffeur.status === DataStatus.DELETED) {
      throw new Error('삭제된 기사 정보는 조회할 수 없습니다.');
    }

    const chauffeurDto = plainToInstance(ChauffeurResponseDto, chauffeur, classTransformDefaultOptions);

    // 차량 정보 조회
    if (chauffeur.vehicleId) {
      try {
        const vehicle = await this.vehicleServiceOutPort.findById(chauffeur.vehicleId);
        if (vehicle) {
          chauffeurDto.vehicle = plainToInstance(
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

          // 차고지 정보 조회 (차량이 있는 경우)
          if (vehicle.garageId) {
            try {
              const garage = await this.garageServiceOutPort.findById(vehicle.garageId);
              if (garage) {
                chauffeurDto.garage = plainToInstance(
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
            } catch {
              chauffeurDto.garage = null;
            }
          }
        }
      } catch {
        chauffeurDto.vehicle = null;
      }
    }

    return chauffeurDto;
  }

  async create(createChauffeur: CreateChauffeurDto): Promise<void> {
    const chauffeur = plainToInstance(Chauffeur, createChauffeur);
    await this.chauffeurServiceOutPort.save(chauffeur);
  }

  async update(id: number, updateChauffeur: UpdateChauffeurDto): Promise<void> {
    const existingChauffeur = await this.chauffeurServiceOutPort.findById(id);
    if (!existingChauffeur) throw new Error('기사를 찾을 수 없습니다.');

    // 타입 변경이 시도된 경우 검증
    if (updateChauffeur.type !== undefined && updateChauffeur.type !== existingChauffeur.type) {
      // 현재 또는 미래 운행이 있는지 확인
      const operationPagination = new PaginationQuery();
      operationPagination.page = 1;
      operationPagination.countPerPage = 100;

      const [operations] = await this.operationServiceOutPort.findAll({ chauffeurId: id }, operationPagination);

      const currentTime = new Date();
      const hasActiveOperations = operations.some((op) => {
        // 진행 중이거나 미래의 운행이 있는지 확인
        return (
          op.status !== DataStatus.DELETED &&
          op.status !== DataStatus.COMPLETED &&
          (!op.startTime || op.startTime >= currentTime || !op.endTime)
        );
      });

      if (hasActiveOperations) {
        const error = new Error('행사 예약이 있는 쇼퍼의 타입은 변경할 수 없습니다.');
        (error as unknown).statusCode = 400;
        throw error;
      }
    }

    await this.chauffeurServiceOutPort.update(id, updateChauffeur);
  }

  async delete(id: number): Promise<void> {
    const chauffeur = await this.chauffeurServiceOutPort.findById(id);
    if (!chauffeur) throw new Error('기사를 찾을 수 없습니다.');

    // 이미 삭제된 쇼퍼인 경우 예외 처리
    if (chauffeur.status === DataStatus.DELETED) {
      throw new Error('이미 삭제된 기사입니다.');
    }

    await this.chauffeurServiceOutPort.update(id, { status: DataStatus.DELETED });
  }

  async changeStatus(chauffeurId: number, changeStatusDto: ChangeChauffeurStatusDto): Promise<ChauffeurStatusChangeResponseDto> {
    const chauffeur = await this.chauffeurServiceOutPort.findById(chauffeurId);

    // 기존 상태에서 허용되지 않는 상태 변경인지 검증
    // (기존 검증 로직 유지)

    // 기사 상태 업데이트
    await this.chauffeurServiceOutPort.update(chauffeurId, {
      chauffeurStatus: changeStatusDto.updateStatus,
    });

    // 기사 상태 변경 시 현재 위치의 waypoint에 상태 저장
    await this.updateWayPointChauffeurStatus(chauffeurId, changeStatusDto.updateStatus);

    const response = new ChauffeurStatusChangeResponseDto();
    response.chauffeurStatus = changeStatusDto.updateStatus;

    // 상태별 추가 로직 처리
    switch (changeStatusDto.updateStatus) {
      case ChauffeurStatus.RECEIVED_VEHICLE:
        // 차량 인수: 근무 시작
        try {
          if (!chauffeur) throw new Error('기사를 찾을 수 없습니다.');
          await this.workHistoryService.startWork(chauffeurId, chauffeur.vehicleId || undefined);
        } catch (error) {
          console.error('근무 시작 기록 실패:', error);
          // 근무 기록 실패해도 상태 변경은 계속 진행
        }
        break;

      case ChauffeurStatus.OFF_DUTY:
        // 근무 종료: 근무 종료 기록만 처리 (상주/비상주는 차량 배정 해제하지 않음)
        try {
          if (!chauffeur) throw new Error('기사를 찾을 수 없습니다.');
          await this.workHistoryService.endWork(chauffeurId);
        } catch (error) {
          console.error('근무 종료 기록 실패:', error);
          // 근무 기록 실패해도 전체 플로우는 계속 진행
        }
        // 상주/비상주 쇼퍼가 아닌 경우에만 차량 배정 해제
        if (chauffeur && chauffeur.type !== ChauffeurType.RESIDENT && chauffeur.type !== ChauffeurType.NON_RESIDENT) {
          await this.chauffeurServiceOutPort.update(chauffeurId, {
            vehicleId: null,
            isVehicleAssigned: false,
          });
        }
        break;

      case ChauffeurStatus.MOVING_TO_DEPARTURE:
        // 예약 대기중 -> 출발지 이동: operation.startTime 설정 및 안심 전화번호 반환
        await this.handleMovingToDeparture(chauffeurId, response);
        break;

      case ChauffeurStatus.WAITING_FOR_PASSENGER:
        // 출발지 이동 -> 고객 탑승대기: 안심 전화번호 반환
        await this.handleWaitingForPassenger(chauffeurId, response);
        break;

      case ChauffeurStatus.IN_OPERATION:
        // 고객 탑승대기 -> 운행 중: 목적지 및 경유지 정보 반환
        await this.handleInOperation(chauffeurId, response);
        // 운행 상태를 USED로 변경
        await this.updateCurrentOperationStatus(chauffeurId, DataStatus.USED);
        break;

      case ChauffeurStatus.WAITING_OPERATION:
        // 운행 중 -> 운행 대기: 안심 전화번호 반환
        await this.handleWaitingOperation(chauffeurId, response);
        break;

      case ChauffeurStatus.PENDING_RECEIPT_INPUT:
        // 운행 중 -> 정보 미기입: 영수증/추가비용 입력 대기 상태로 전환
        await this.handlePendingReceiptInput(chauffeurId, response);
        break;

      case ChauffeurStatus.OPERATION_COMPLETED:
        // 정보 미기입 -> 운행 종료: operation.endTime 설정 및 운행시간 계산 (operation update 완료 후)
        await this.handleOperationCompleted(chauffeurId, response);
        // 운행 상태를 COMPLETED로 변경
        await this.updateCurrentOperationStatus(chauffeurId, DataStatus.COMPLETED);
        break;
    }

    return response;
  }

  // 기사 전용 메서드들
  async getMyProfile(chauffeurId: number): Promise<ChauffeurProfileResponseDto> {
    const chauffeur = await this.chauffeurServiceOutPort.findById(chauffeurId);
    return plainToInstance(ChauffeurProfileResponseDto, chauffeur, classTransformDefaultOptions);
  }

  async getMyAssignedVehicle(chauffeurId: number): Promise<AssignedVehicleResponseDto | null> {
    const chauffeur = await this.chauffeurServiceOutPort.findById(chauffeurId);

    if (!chauffeur) throw new Error('기사를 찾을 수 없습니다.');

    if (!chauffeur.vehicleId) {
      return null;
    }

    const vehicle = await this.vehicleServiceOutPort.findById(chauffeur.vehicleId);

    // 차량이 없거나 삭제된 경우 null 반환
    if (!vehicle || vehicle.status === DataStatus.DELETED) {
      return null;
    }

    return plainToInstance(AssignedVehicleResponseDto, vehicle, classTransformDefaultOptions);
  }

  async getMyCurrentOperation(chauffeurId: number): Promise<CurrentOperationResponseDto | null> {
    const currentOperation = await this.getCurrentOperation(chauffeurId);

    if (!currentOperation) {
      return null;
    }

    const response = plainToInstance(CurrentOperationResponseDto, currentOperation, classTransformDefaultOptions);

    // 예약 정보 조회 (일반 예약인 경우)
    if (currentOperation.type === OperationType.REGULAR) {
      try {
        const reservation = await this.reservationServiceInPort.detail(currentOperation.id);
        response.reservation = plainToInstance(CurrentReservationDto, reservation, classTransformDefaultOptions);
      } catch {
        // 예약 정보가 없는 경우
        response.reservation = null;
      }
    }

    // 실시간 배차 정보 조회 (실시간 배차인 경우)
    if (currentOperation.type === OperationType.REALTIME && currentOperation.realTimeDispatchId) {
      try {
        const realTimeDispatch = await this.realTimeDispatchServiceOutPort.findById(currentOperation.realTimeDispatchId);
        if (!realTimeDispatch) {
          response.departureAddress = null;
          response.destinationAddress = null;
          response.wayPoints = [];
          response.currentWayPoint = null;
          return response;
        }
        response.departureAddress = realTimeDispatch.departureAddress;
        response.destinationAddress = realTimeDispatch.destinationAddress;

        // 쇼퍼앱에서는 실시간 배차 정보를 간단하게 표시
        // 출발지, 도착지 정보를 waypoint 형태로 변환
        response.wayPoints = this.createSimpleWayPointsForChauffeur(realTimeDispatch);
        response.currentWayPoint = await this.getCurrentWayPointForRealTimeDispatch(chauffeurId, realTimeDispatch);
      } catch (error) {
        // 실시간 배차 정보가 없는 경우
        response.departureAddress = null;
        response.destinationAddress = null;
        response.wayPoints = [];
        response.currentWayPoint = null;
      }
    } else {
      // 일반 예약인 경우 기존 로직 유지
      // 경유지 정보 조회 (운행에서 직접 조회)
      try {
        const wayPointPagination = new PaginationQuery();
        wayPointPagination.page = 1;
        wayPointPagination.countPerPage = 100;

        const wayPoints = await this.wayPointServiceInPort.search({ operationId: currentOperation.id }, wayPointPagination);
        const sortedWayPoints = wayPoints.data.sort((a, b) => a.order - b.order);

        response.wayPoints = sortedWayPoints.map((wp) => plainToInstance(CurrentWayPointDto, wp, classTransformDefaultOptions));

        // 현재 진행 중인 waypoint 식별
        response.currentWayPoint = await this.getCurrentWayPoint(chauffeurId, sortedWayPoints);
      } catch {
        response.wayPoints = [];
        response.currentWayPoint = null;
      }
    }

    return response;
  }

  async getMyNearestReservation(chauffeurId: number): Promise<NearestReservationResponseDto | null> {
    // 기사에게 할당된 모든 미래 운행 조회
    const operationPagination = new PaginationQuery();
    operationPagination.page = 1;
    operationPagination.countPerPage = 100; // 충분한 수의 운행을 조회

    const [operations] = await this.operationServiceOutPort.findAll({ chauffeurId }, operationPagination);

    if (operations.length === 0) {
      return null;
    }

    const currentTime = new Date();

    // 미래의 운행들만 필터링
    const futureOperations = operations.filter((op) => {
      // 삭제되거나 완료된 운행 제외
      if (op.status === DataStatus.DELETED || op.status === DataStatus.COMPLETED) {
        return false;
      }

      // endTime이 있고 현재 시간보다 이전이면 제외
      if (op.endTime && op.endTime <= currentTime) {
        return false;
      }

      // startTime이 있는 경우: 현재 시간 이후만 포함
      if (op.startTime) {
        return op.startTime > currentTime;
      }

      // startTime이 없는 경우: 아직 시작하지 않은 예약으로 간주
      return true;
    });

    if (futureOperations.length === 0) {
      return null;
    }

    // 시작 시간 기준으로 정렬 (가장 빠른 것이 첫 번째)
    const sortedOperations = futureOperations.sort((a, b) => {
      // startTime이 있는 것을 우선
      if (a.startTime && b.startTime) {
        return a.startTime.getTime() - b.startTime.getTime();
      }
      if (a.startTime && !b.startTime) return -1;
      if (!a.startTime && b.startTime) return 1;

      // 둘 다 startTime이 없으면 생성일 기준
      return a.createdAt.getTime() - b.createdAt.getTime();
    });

    const nearestOperation = sortedOperations[0];

    // 응답 DTO 구성
    const response = new NearestReservationResponseDto();

    // Operation 정보
    response.operation = plainToInstance(
      NextOperationDto,
      {
        id: nearestOperation.id,
        type: nearestOperation.type,
        startTime: nearestOperation.startTime,
        endTime: nearestOperation.endTime,
        minutesUntilStart: nearestOperation.startTime
          ? Math.floor((nearestOperation.startTime.getTime() - currentTime.getTime()) / (1000 * 60))
          : null,
      },
      classTransformDefaultOptions,
    );

    // 예약 정보 조회 (일반 예약인 경우)
    if (nearestOperation.type === OperationType.REGULAR) {
      try {
        // operationId로 예약 검색
        const reservationPagination = new PaginationQuery();
        reservationPagination.page = 1;
        reservationPagination.countPerPage = 1;

        const reservations = await this.reservationServiceInPort.search(
          { operationId: nearestOperation.id },
          reservationPagination,
        );

        if (reservations.data.length > 0) {
          response.reservation = plainToInstance(NextReservationDto, reservations.data[0], classTransformDefaultOptions);
        } else {
          response.reservation = null;
        }
      } catch {
        response.reservation = null;
      }
    } else {
      response.reservation = null;
    }

    // 경유지 정보 조회
    try {
      const wayPointPagination = new PaginationQuery();
      wayPointPagination.page = 1;
      wayPointPagination.countPerPage = 100;

      const wayPoints = await this.wayPointServiceInPort.search({ operationId: nearestOperation.id }, wayPointPagination);
      response.wayPoints = wayPoints.data
        .sort((a, b) => a.order - b.order)
        .map((wp) => plainToInstance(NextWayPointDto, wp, classTransformDefaultOptions));
    } catch {
      response.wayPoints = [];
    }

    // 실시간 배차 정보 조회 (실시간 배차인 경우)
    if (nearestOperation.type === OperationType.REALTIME && nearestOperation.realTimeDispatchId) {
      try {
        const realTimeDispatch = await this.realTimeDispatchServiceOutPort.findById(nearestOperation.realTimeDispatchId);
        if (!realTimeDispatch) throw new Error('실시간 배차 정보를 찾을 수 없습니다.');
        response.departureAddress = realTimeDispatch.departureAddress;
        response.destinationAddress = realTimeDispatch.destinationAddress;
      } catch {
        response.departureAddress = null;
        response.destinationAddress = null;
      }
    } else {
      response.departureAddress = null;
      response.destinationAddress = null;
    }

    return response;
  }

  private async handleMovingToDeparture(chauffeurId: number, response: ChauffeurStatusChangeResponseDto): Promise<void> {
    const currentOperation = await this.getCurrentOperation(chauffeurId);
    if (currentOperation) {
      await this.operationServiceOutPort.update(currentOperation.id, {
        startTime: new Date(),
      });

      try {
        const reservation = await this.reservationServiceInPort.detail(currentOperation.id);
        response.safetyPhone = reservation.safetyPhone ?? undefined;
      } catch {
        // 예약 정보가 없는 경우
        response.safetyPhone = undefined;
      }
    }
  }

  private async handleWaitingForPassenger(chauffeurId: number, response: ChauffeurStatusChangeResponseDto): Promise<void> {
    const currentOperation = await this.getCurrentOperation(chauffeurId);
    if (currentOperation) {
      try {
        const reservation = await this.reservationServiceInPort.detail(currentOperation.id);
        response.safetyPhone = reservation.safetyPhone ?? undefined;
      } catch {
        // 예약 정보가 없는 경우
        response.safetyPhone = undefined;
      }
    }
  }

  private async handleInOperation(chauffeurId: number, response: ChauffeurStatusChangeResponseDto): Promise<void> {
    const currentOperation = await this.getCurrentOperation(chauffeurId);
    if (currentOperation) {
      try {
        const reservation = await this.reservationServiceInPort.detail(currentOperation.id);
      } catch {
        // 예약 정보가 없는 경우 - 계속 진행
      }

      const wayPointPagination = new PaginationQuery();
      wayPointPagination.page = 1;
      wayPointPagination.countPerPage = 100;

      const wayPoints = await this.wayPointServiceInPort.search({ operationId: currentOperation.id }, wayPointPagination);

      response.hasWayPoints = wayPoints.data.length > 0;

      if (wayPoints.data.length > 0) {
        response.wayPoints = wayPoints.data
          .sort((a, b) => a.order - b.order)
          .map((wp) => plainToInstance(WayPointInfo, wp, classTransformDefaultOptions));
      }
    }
  }

  private async handleWaitingOperation(chauffeurId: number, response: ChauffeurStatusChangeResponseDto): Promise<void> {
    const currentOperation = await this.getCurrentOperation(chauffeurId);
    if (currentOperation) {
      try {
        const reservation = await this.reservationServiceInPort.detail(currentOperation.id);
        response.safetyPhone = reservation.safetyPhone ?? undefined;
      } catch {
        // 예약 정보가 없는 경우
        response.safetyPhone = undefined;
      }
    }
  }

  private async handleOperationCompleted(chauffeurId: number, response: ChauffeurStatusChangeResponseDto): Promise<void> {
    const currentOperation = await this.getCurrentOperation(chauffeurId);
    if (currentOperation && currentOperation.startTime) {
      const endTime = new Date();
      await this.operationServiceOutPort.update(currentOperation.id, {
        endTime,
      });

      const operationTimeMs = endTime.getTime() - currentOperation.startTime.getTime();
      response.operationTimeMinutes = Math.floor(operationTimeMs / (1000 * 60));
    }
  }

  private async handlePendingReceiptInput(chauffeurId: number, response: ChauffeurStatusChangeResponseDto): Promise<void> {
    // 운행 중에서 정보 미기입 상태로 전환 시 endTime 설정
    const currentOperation = await this.getCurrentOperation(chauffeurId);
    if (currentOperation && currentOperation.startTime) {
      const endTime = new Date();
      await this.operationServiceOutPort.update(currentOperation.id, {
        endTime,
      });

      const operationTimeMs = endTime.getTime() - currentOperation.startTime.getTime();
      response.operationTimeMinutes = Math.floor(operationTimeMs / (1000 * 60));
    }

    // 이 상태에서는 클라이언트가 영수증 및 추가비용 정보를 입력할 수 있음
    // operation update API 호출 시 자동으로 OPERATION_COMPLETED 상태로 전환됨
  }

  private async getCurrentOperation(chauffeurId: number) {
    const operationPagination = new PaginationQuery();
    operationPagination.page = 1;
    operationPagination.countPerPage = 10; // 충분한 수의 운행을 조회

    const [operations, totalCount] = await this.operationServiceOutPort.findAll({ chauffeurId }, operationPagination);

    if (totalCount > 0) {
      const currentTime = new Date();

      // 현재 진행 중인 운행: 삭제되지 않고, 완료되지 않은 운행
      const currentOperations = operations.filter((op) => {
        // 삭제되거나 완료된 운행 제외
        if (op.status === DataStatus.DELETED || op.status === DataStatus.COMPLETED) {
          return false;
        }

        // endTime이 있고 현재 시간보다 이전이면 제외
        if (op.endTime && op.endTime <= currentTime) {
          return false;
        }

        // startTime이 있고 현재 시간보다 너무 이전이면 제외 (24시간 이전)
        if (op.startTime && op.startTime < new Date(currentTime.getTime() - 24 * 60 * 60 * 1000)) {
          return false;
        }

        return true;
      });

      if (currentOperations.length > 0) {
        // 시작 시간이 있는 것 우선, 그 다음 최신 순
        currentOperations.sort((a, b) => {
          if (a.startTime && b.startTime) {
            return b.startTime.getTime() - a.startTime.getTime();
          }
          if (a.startTime && !b.startTime) return -1;
          if (!a.startTime && b.startTime) return 1;
          return b.createdAt.getTime() - a.createdAt.getTime();
        });

        return currentOperations[0];
      }
    }

    return null;
  }

  /**
   * 현재 진행 중인 waypoint를 식별하는 메서드
   */
  private async getCurrentWayPoint(chauffeurId: number, sortedWayPoints: unknown[]): Promise<CurrentWayPointDto | null> {
    try {
      const chauffeur = await this.chauffeurServiceOutPort.findById(chauffeurId);

      if (!chauffeur || sortedWayPoints.length === 0) {
        return null;
      }

      // "출발지 이동" 상태 이후에만 currentWayPoint 반환
      if (chauffeur.chauffeurStatus === ChauffeurStatus.WAITING_FOR_RESERVATION) {
        return null; // 예약 대기 중에는 currentWayPoint 반환하지 않음
      }

      switch (chauffeur.chauffeurStatus) {
        case ChauffeurStatus.MOVING_TO_DEPARTURE:
        case ChauffeurStatus.WAITING_FOR_PASSENGER:
          // 출발지로 이동 중이거나 고객 탑승 대기 중 → 첫 번째 waypoint
          return plainToInstance(CurrentWayPointDto, sortedWayPoints[0], classTransformDefaultOptions);

        case ChauffeurStatus.IN_OPERATION:
          // 운행 중 → 다음 목적지 waypoint (아직 방문하지 않은 waypoint 중 첫 번째)
          const nextWayPoint = sortedWayPoints.find((wp) => !wp.chauffeurStatus || !wp.visitTime);
          if (nextWayPoint) {
            return plainToInstance(CurrentWayPointDto, nextWayPoint, classTransformDefaultOptions);
          }
          // 모든 waypoint를 방문했다면 마지막 waypoint
          return plainToInstance(CurrentWayPointDto, sortedWayPoints[sortedWayPoints.length - 1], classTransformDefaultOptions);

        case ChauffeurStatus.WAITING_OPERATION:
          // 운행 대기 → 현재 위치한 waypoint (가장 최근에 방문한 waypoint)
          const visitedWayPoints = sortedWayPoints.filter((wp) => wp.chauffeurStatus && wp.visitTime);
          if (visitedWayPoints.length > 0) {
            // visitTime 기준으로 가장 최근 방문한 waypoint
            const latestVisited = visitedWayPoints.sort(
              (a, b) => new Date(b.visitTime).getTime() - new Date(a.visitTime).getTime(),
            )[0];
            return plainToInstance(CurrentWayPointDto, latestVisited, classTransformDefaultOptions);
          }
          // 방문한 waypoint가 없다면 첫 번째 waypoint
          return plainToInstance(CurrentWayPointDto, sortedWayPoints[0], classTransformDefaultOptions);

        case ChauffeurStatus.OPERATION_COMPLETED:
          // 운행 완료 → 마지막 waypoint
          return plainToInstance(CurrentWayPointDto, sortedWayPoints[sortedWayPoints.length - 1], classTransformDefaultOptions);

        default:
          // 기타 상태 → null
          return null;
      }
    } catch (error) {
      console.error('Failed to get current waypoint:', error);
      return null;
    }
  }

  /**
   * 기사 상태 변경 시 현재 위치의 waypoint에 기사 상태를 저장하는 메서드
   */
  private async checkVehicleAssignmentConflict(vehicleId: number, excludeChauffeurId?: number): Promise<void> {
    const assignedChauffeurs = await this.chauffeurServiceOutPort.findByVehicleId(vehicleId);
    const conflictingChauffeurs = assignedChauffeurs.filter((c) => c.id !== excludeChauffeurId && c.isVehicleAssigned);

    if (conflictingChauffeurs.length > 0) {
      throw new Error(`차량 ID ${vehicleId}는 이미 다른 기사에게 배정되어 있습니다.`);
    }
  }

  private async unassignVehicleFromChauffeur(chauffeurId: number): Promise<void> {
    const chauffeur = await this.chauffeurServiceOutPort.findById(chauffeurId);
    if (!chauffeur || !chauffeur.vehicleId) return;

    const vehicleId = chauffeur.vehicleId;

    // 현재 기사의 배정 해제
    await this.chauffeurServiceOutPort.update(chauffeurId, {
      vehicleId: null,
      isVehicleAssigned: false,
    });

    // 해당 차량에 배정된 다른 기사들의 상태도 확인하여 중복 배정 정리
    const assignedChauffeurs = await this.chauffeurServiceOutPort.findByVehicleId(vehicleId);
    for (const otherChauffeur of assignedChauffeurs) {
      if (otherChauffeur.id !== chauffeurId && otherChauffeur.isVehicleAssigned) {
        console.warn(`차량 ID ${vehicleId}에 중복 배정된 기사 발견: ${otherChauffeur.id}`);
        // 중복 배정된 기사도 배정 해제
        await this.chauffeurServiceOutPort.update(otherChauffeur.id, {
          vehicleId: null,
          isVehicleAssigned: false,
        });
      }
    }
  }

  private async updateWayPointChauffeurStatus(chauffeurId: number, chauffeurStatus: ChauffeurStatus): Promise<void> {
    try {
      // 현재 기사의 진행 중인 operation 조회
      const currentOperation = await this.getCurrentOperation(chauffeurId);

      if (!currentOperation) {
        return; // 진행 중인 운행이 없으면 waypoint 업데이트 불필요
      }

      // 해당 operation의 waypoint들 조회
      const wayPointPagination = new PaginationQuery();
      wayPointPagination.page = 1;
      wayPointPagination.countPerPage = 100;

      const wayPointsResponse = await this.wayPointServiceInPort.search({ operationId: currentOperation.id }, wayPointPagination);

      // 실시간 배차인데 WayPoint가 없는 경우 자동 생성
      if (
        wayPointsResponse.data.length === 0 &&
        currentOperation.type === OperationType.REALTIME &&
        currentOperation.realTimeDispatchId
      ) {
        await this.createMissingRealTimeDispatchWayPoints(currentOperation.id, currentOperation.realTimeDispatchId);

        // 다시 조회
        const updatedWayPointsResponse = await this.wayPointServiceInPort.search(
          { operationId: currentOperation.id },
          wayPointPagination,
        );
        wayPointsResponse.data = updatedWayPointsResponse.data;
      }

      if (wayPointsResponse.data.length === 0) {
        return; // waypoint가 없으면 업데이트 불필요
      }

      // waypoint들을 order 순으로 정렬
      const wayPoints = wayPointsResponse.data.sort((a, b) => a.order - b.order);

      // 기사 상태에 따른 현재 위치 waypoint 찾기
      let targetWayPointId: number | null = null;

      switch (chauffeurStatus) {
        case ChauffeurStatus.WAITING_FOR_PASSENGER:
          // 출발지에 도착 - 첫 번째 waypoint (order=1)
          const firstWayPoint = wayPoints.find((wp) => wp.order === 1);
          if (firstWayPoint) {
            targetWayPointId = firstWayPoint.id;
          }
          break;

        case ChauffeurStatus.WAITING_OPERATION:
          // 경유지에 도착 - 현재 진행 중인 waypoint를 찾아야 함
          // 여기서는 가장 최근에 업데이트된 waypoint 다음 순서를 사용
          // 실제 구현에서는 더 정교한 로직이 필요할 수 있음
          for (let i = 0; i < wayPoints.length; i++) {
            // 기존에 chauffeurStatus가 없는 waypoint 중 첫 번째를 선택
            const wayPoint = await this.wayPointServiceOutPort.findById(wayPoints[i].id);
            if (wayPoint && !wayPoint.chauffeurStatus) {
              targetWayPointId = wayPoint.id;
              break;
            }
          }
          break;

        case ChauffeurStatus.OPERATION_COMPLETED:
          // 운행 완료 - 마지막 waypoint
          const lastWayPoint = wayPoints[wayPoints.length - 1];
          if (lastWayPoint) {
            targetWayPointId = lastWayPoint.id;
          }
          break;

        default:
          // 다른 상태들은 waypoint 업데이트 불필요
          break;
      }

      // 대상 waypoint에 기사 상태 업데이트
      if (targetWayPointId) {
        await this.wayPointServiceOutPort.update(targetWayPointId, {
          chauffeurStatus: chauffeurStatus,
          visitTime: new Date(), // 방문 시간 기록
        });
      }
    } catch (error) {
      // waypoint 업데이트 실패 시 로그만 남기고 전체 플로우는 계속 진행
      console.error('Failed to update waypoint chauffeur status:', error);
    }
  }

  /**
   * 실시간 배차를 위한 WayPoint 자동 생성 (편도 기본)
   * @param operationId 운행 ID
   * @param realTimeDispatchId 실시간 배차 ID
   * @param isRoundTrip 왕복 여부 (기본값: false)
   */
  private async createMissingRealTimeDispatchWayPoints(
    operationId: number,
    realTimeDispatchId: number,
    isRoundTrip: boolean = false,
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

      // 2. 왕복인 경우 목적지 WayPoint 생성 (order=2)
      if (isRoundTrip) {
        await this.wayPointServiceInPort.create({
          operationId: operationId,
          name: realTimeDispatch.destinationName,
          address: realTimeDispatch.destinationAddress,
          addressDetail: realTimeDispatch.destinationAddressDetail,
          order: 2,
        });
      }
    } catch (error) {
      console.error('Failed to create missing real-time dispatch waypoints:', error);
      // 에러가 발생해도 전체 플로우를 중단하지 않음
    }
  }

  /**
   * 기존 실시간 배차 Operation들에 대해 WayPoint를 일괄 생성
   * @param isRoundTrip 왕복 여부 (기본값: false - 편도)
   */
  async createWayPointsForExistingRealTimeDispatches(isRoundTrip: boolean = false): Promise<void> {
    try {
      // 실시간 배차 타입의 Operation들을 조회
      const operationPagination = new PaginationQuery();
      operationPagination.page = 1;
      operationPagination.countPerPage = 1000; // 충분한 수로 설정

      const [operations] = await this.operationServiceOutPort.findAll({ type: OperationType.REALTIME }, operationPagination);

      for (const operation of operations) {
        if (operation.realTimeDispatchId) {
          // 이미 WayPoint가 있는지 확인
          const wayPointPagination = new PaginationQuery();
          wayPointPagination.page = 1;
          wayPointPagination.countPerPage = 10;

          const wayPoints = await this.wayPointServiceInPort.search({ operationId: operation.id }, wayPointPagination);

          // WayPoint가 없으면 생성
          if (wayPoints.data.length === 0) {
            await this.createMissingRealTimeDispatchWayPoints(operation.id, operation.realTimeDispatchId, isRoundTrip);
          }
        }
      }
    } catch (error) {
      console.error('Failed to create waypoints for existing real-time dispatches:', error);
    }
  }

  // 위치 관련 메서드들
  async updateMyLocation(chauffeurId: number, updateLocationDto: UpdateLocationDto): Promise<void> {
    const chauffeur = await this.chauffeurServiceOutPort.findById(chauffeurId);
    if (!chauffeur) throw new Error('기사를 찾을 수 없습니다.');
    await this.chauffeurServiceOutPort.updateLocation(chauffeurId, updateLocationDto.latitude, updateLocationDto.longitude);
  }

  async getMyLocation(chauffeurId: number): Promise<LocationResponseDto> {
    const chauffeur = await this.chauffeurServiceOutPort.findById(chauffeurId);
    if (!chauffeur) throw new Error('기사를 찾을 수 없습니다.');
    return plainToInstance(
      LocationResponseDto,
      {
        latitude: chauffeur.latitude,
        longitude: chauffeur.longitude,
      },
      classTransformDefaultOptions,
    );
  }

  /**
   * 행사 쇼퍼의 오늘 배차 상태를 확인하고 필요시 차량 배정 해제
   */
  async checkAndUpdateEventChauffeurStatus(chauffeurId: number): Promise<void> {
    try {
      const chauffeur = await this.chauffeurServiceOutPort.findById(chauffeurId);

      if (!chauffeur) throw new Error('기사를 찾을 수 없습니다.');

      // 행사 쇼퍼가 아니면 처리하지 않음
      if (chauffeur.type !== ChauffeurType.EVENT) {
        return;
      }

      // 오늘 날짜의 배차(운행) 확인
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const operationPagination = new PaginationQuery();
      operationPagination.page = 1;
      operationPagination.countPerPage = 100;

      const [operations] = await this.operationServiceOutPort.findAll({ chauffeurId }, operationPagination);

      // 오늘 날짜에 해당하는 운행이 있는지 확인
      const todayOperations = operations.filter((op) => {
        if (!op.startTime) return false;
        const opDate = new Date(op.startTime);
        return opDate >= todayStart && opDate <= todayEnd;
      });

      // 오늘 배차가 없으면 차량 배정 해제
      if (todayOperations.length === 0) {
        await this.chauffeurServiceOutPort.update(chauffeurId, {
          isVehicleAssigned: false,
          vehicleId: null, // 차량 배정도 해제
        });
      }
    } catch (error) {
      console.error('Failed to check event chauffeur status:', error);
    }
  }

  /**
   * 기사 타입별 배차 가능 여부 확인
   */
  async canAssignVehicle(chauffeurId: number): Promise<boolean> {
    try {
      const chauffeur = await this.chauffeurServiceOutPort.findById(chauffeurId);

      if (!chauffeur) throw new Error('기사를 찾을 수 없습니다.');

      // 차량이 이미 배정되어 있으면 배차 불가능
      if (chauffeur.isVehicleAssigned) {
        return false;
      }

      // 기사 타입이 없으면 배차 불가능
      if (!chauffeur.type) {
        return false;
      }

      switch (chauffeur.type) {
        case ChauffeurType.RESIDENT:
        case ChauffeurType.NON_RESIDENT:
          // 상주, 비상주는 배차 가능 (근무 종료 상태일 때)
          return chauffeur.chauffeurStatus === ChauffeurStatus.OFF_DUTY;

        case ChauffeurType.EVENT:
          // 행사는 예약과 함께만 배차 가능
          return false;

        case ChauffeurType.HOSPITAL:
          // 병원은 기존 로직 유지 (배차 가능)
          return chauffeur.chauffeurStatus === ChauffeurStatus.OFF_DUTY;

        default:
          return false;
      }
    } catch (error) {
      console.error('Failed to check vehicle assignment eligibility:', error);
      return false;
    }
  }

  /**
   * 기사 타입별 차량 변경 가능 여부 확인
   */
  async canChangeVehicle(chauffeurId: number): Promise<boolean> {
    try {
      const chauffeur = await this.chauffeurServiceOutPort.findById(chauffeurId);

      if (!chauffeur) throw new Error('기사를 찾을 수 없습니다.');

      // 차량이 배정되어 있지 않으면 차량 변경 불가능
      if (!chauffeur.isVehicleAssigned) {
        return false;
      }

      // 기사 타입이 없으면 차량 변경 불가능
      if (!chauffeur.type) {
        return false;
      }

      switch (chauffeur.type) {
        case ChauffeurType.RESIDENT:
        case ChauffeurType.NON_RESIDENT:
          // 상주, 비상주는 근무 종료 상태에서 차량 변경 가능
          return chauffeur.chauffeurStatus === ChauffeurStatus.OFF_DUTY;

        case ChauffeurType.EVENT:
          // 행사는 차량 변경 불가능 (예약과 함께만 배차)
          return false;

        case ChauffeurType.HOSPITAL:
          // 병원은 근무 종료 상태에서 차량 변경 가능
          return chauffeur.chauffeurStatus === ChauffeurStatus.OFF_DUTY;

        default:
          return false;
      }
    } catch (error) {
      console.error('Failed to check vehicle change eligibility:', error);
      return false;
    }
  }

  /**
   * 현재 운행의 DataStatus를 업데이트하는 메서드
   */
  private async updateCurrentOperationStatus(chauffeurId: number, status: DataStatus): Promise<void> {
    try {
      const currentOperation = await this.getCurrentOperation(chauffeurId);
      if (currentOperation) {
        await this.operationServiceOutPort.update(currentOperation.id, {
          status: status,
        });
      }
    } catch (error) {
      console.error('Failed to update operation status:', error);
    }
  }

  /**
   * 실시간 배차 정보를 쇼퍼앱용 간단한 waypoint 형태로 변환
   */
  private createSimpleWayPointsForChauffeur(realTimeDispatch: unknown): CurrentWayPointDto[] {
    const wayPoints: CurrentWayPointDto[] = [];

    // 1. 출발지 (항상 표시)
    wayPoints.push(
      plainToInstance(
        CurrentWayPointDto,
        {
          id: 0, // 임시 ID
          name: realTimeDispatch.departureName,
          address: realTimeDispatch.departureAddress,
          addressDetail: realTimeDispatch.departureAddressDetail,
          order: 1,
          visitTime: null,
          chauffeurStatus: null,
        },
        classTransformDefaultOptions,
      ),
    );

    // 2. 도착지 (항상 표시)
    wayPoints.push(
      plainToInstance(
        CurrentWayPointDto,
        {
          id: 0, // 임시 ID
          name: realTimeDispatch.destinationName,
          address: realTimeDispatch.destinationAddress,
          addressDetail: realTimeDispatch.destinationAddressDetail,
          order: 2,
          visitTime: null,
          chauffeurStatus: null,
        },
        classTransformDefaultOptions,
      ),
    );

    return wayPoints;
  }

  /**
   * 실시간 배차에서 현재 진행 중인 waypoint 정보 반환
   */
  private async getCurrentWayPointForRealTimeDispatch(
    chauffeurId: number,
    realTimeDispatch: unknown,
  ): Promise<CurrentWayPointDto | null> {
    try {
      const chauffeur = await this.chauffeurServiceOutPort.findById(chauffeurId);

      if (!chauffeur) {
        return null;
      }

      switch (chauffeur.chauffeurStatus) {
        case ChauffeurStatus.MOVING_TO_DEPARTURE:
        case ChauffeurStatus.WAITING_FOR_PASSENGER:
        case ChauffeurStatus.IN_OPERATION:
          // 출발지 정보 반환
          return plainToInstance(
            CurrentWayPointDto,
            {
              id: 0, // 임시 ID
              name: realTimeDispatch.departureName,
              address: realTimeDispatch.departureAddress,
              addressDetail: realTimeDispatch.departureAddressDetail,
              order: 1,
              visitTime: null,
              chauffeurStatus: chauffeur.chauffeurStatus,
            },
            classTransformDefaultOptions,
          );

        case ChauffeurStatus.WAITING_OPERATION:
        case ChauffeurStatus.OPERATION_COMPLETED:
          // 도착지 정보 반환
          return plainToInstance(
            CurrentWayPointDto,
            {
              id: 0, // 임시 ID
              name: realTimeDispatch.destinationName,
              address: realTimeDispatch.destinationAddress,
              addressDetail: realTimeDispatch.destinationAddressDetail,
              order: 2,
              visitTime: null,
              chauffeurStatus: chauffeur.chauffeurStatus,
            },
            classTransformDefaultOptions,
          );

        default:
          return null;
      }
    } catch (error) {
      console.error('Failed to get current waypoint for real-time dispatch:', error);
      return null;
    }
  }
}
