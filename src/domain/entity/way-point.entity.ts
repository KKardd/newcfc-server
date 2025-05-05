import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '@/domain/entity/base.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';

@Entity('way_point')
export class WayPoint extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'reservation_id', type: 'integer', nullable: false })
  reservationId: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  address: string;

  @Column({ type: 'integer', nullable: false })
  order: number;

  @Column({ type: 'enum', enum: DataStatus, default: DataStatus.REGISTER })
  status: DataStatus;
}
