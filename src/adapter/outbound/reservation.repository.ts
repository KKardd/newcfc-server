import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchReservationDto } from '@/adapter/inbound/dto/request/reservation/search-reservation.dto';
import { Reservation } from '@/domain/entity/reservation.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { ReservationServiceOutPort } from '@/port/outbound/reservation-service.out-port';
import { CustomRepository } from '@/util/custom-repository.decorator';
import { CustomRepository as BaseRepository } from './custom.repository';

@CustomRepository(Reservation)
export class ReservationRepository extends BaseRepository<Reservation> implements ReservationServiceOutPort {
  async findAll(search: SearchReservationDto, paginationQuery: PaginationQuery): Promise<[Reservation[], number]> {
    const queryBuilder = this.createQueryBuilder('reservation').leftJoinAndSelect('reservation.operation', 'operation');

    if (search.operationId) {
      queryBuilder.andWhere('reservation.operation_id = :operationId', {
        operationId: search.operationId,
      });
    }

    if (search.passengerName) {
      queryBuilder.andWhere('reservation.passenger_name LIKE :passengerName', {
        passengerName: `%${search.passengerName}%`,
      });
    }

    if (search.passengerPhone) {
      queryBuilder.andWhere('reservation.passenger_phone LIKE :passengerPhone', {
        passengerPhone: `%${search.passengerPhone}%`,
      });
    }

    if (search.passengerEmail) {
      queryBuilder.andWhere('reservation.passenger_email LIKE :passengerEmail', {
        passengerEmail: `%${search.passengerEmail}%`,
      });
    }

    if (search.passengerCount) {
      queryBuilder.andWhere('reservation.passenger_count = :passengerCount', {
        passengerCount: search.passengerCount,
      });
    }

    if (search.status) {
      queryBuilder.andWhere('reservation.status = :status', {
        status: search.status,
      });
    }

    queryBuilder.orderBy('reservation.createdAt', 'DESC').skip(paginationQuery.skip).take(paginationQuery.countPerPage);

    return queryBuilder.getManyAndCount();
  }

  async findById(id: number): Promise<Reservation> {
    return this.findOneOrFail({
      where: { id },
      relations: ['operation'],
    });
  }

  async updateStatus(id: number, status: DataStatus) {
    return this.update(id, { status });
  }
}
