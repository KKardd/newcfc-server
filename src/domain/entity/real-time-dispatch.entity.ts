import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '@/domain/entity/base.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';

@Entity('real_time_dispatch')
export class RealTimeDispatch extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'departure_name', type: 'varchar', length: 100, nullable: false })
  departureName: string;

  @Column({ name: 'departure_address', type: 'varchar', length: 255, nullable: false })
  departureAddress: string;

  @Column({ name: 'departure_address_detail', type: 'varchar', length: 255, nullable: true })
  departureAddressDetail: string;

  @Column({ name: 'destination_name', type: 'varchar', length: 100, nullable: false })
  destinationName: string;

  @Column({ name: 'destination_address', type: 'varchar', length: 255, nullable: false })
  destinationAddress: string;

  @Column({ name: 'destination_address_detail', type: 'varchar', length: 255, nullable: true })
  destinationAddressDetail: string;

  @Column({ type: 'enum', enum: DataStatus, default: DataStatus.REGISTER })
  status: DataStatus;
}
