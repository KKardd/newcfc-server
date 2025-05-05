import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '@/domain/entity/base.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';

@Entity('reservation')
export class Reservation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'operation_id', type: 'integer', nullable: false, unique: true })
  operationId: number;

  @Column({ name: 'passenger_name', type: 'varchar', length: 100, nullable: false })
  passengerName: string;

  @Column({ name: 'passenger_phone', type: 'varchar', length: 20, nullable: false })
  passengerPhone: string;

  @Column({ name: 'passenger_email', type: 'varchar', length: 100, nullable: true })
  passengerEmail: string | null;

  @Column({ name: 'passenger_count', type: 'integer', default: 1 })
  passengerCount: number;

  @Column({ name: 'safety_phone', type: 'varchar', length: 20, nullable: true })
  safetyPhone: string | null;

  @Column({ type: 'text', nullable: true })
  memo: string | null;

  @Column({ type: 'enum', enum: DataStatus, default: DataStatus.REGISTER })
  status: DataStatus;
}
