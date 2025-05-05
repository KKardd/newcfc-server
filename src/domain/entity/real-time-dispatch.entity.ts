import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '@/domain/entity/base.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';

@Entity('real_time_dispatch')
export class RealTimeDispatch extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'departure_address', type: 'varchar', length: 255, nullable: false })
  departureAddress: string;

  @Column({ name: 'destination_address', type: 'varchar', length: 255, nullable: false })
  destinationAddress: string;

  @Column({ type: 'enum', enum: DataStatus, default: DataStatus.REGISTER })
  status: DataStatus;
}
