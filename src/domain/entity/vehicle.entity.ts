import { Column, Entity, Index, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '@/domain/entity/base.entity';
import { Garage } from '@/domain/entity/garage.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { VehicleStatus } from '@/domain/enum/vehicle-status.enum';

@Entity('vehicle')
export class Vehicle extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'vehicle_number', type: 'varchar', length: 20, nullable: false })
  @Index()
  vehicleNumber: string;

  @Column({ name: 'model_name', type: 'varchar', length: 100, nullable: false })
  modelName: string;

  @Column({ name: 'garage_id', type: 'integer', nullable: false })
  garageId: number;

  @Column({ name: 'vehicle_status', type: 'enum', enum: VehicleStatus, default: VehicleStatus.NORMAL })
  vehicleStatus: VehicleStatus;

  @Column({ type: 'enum', enum: DataStatus, default: DataStatus.REGISTER })
  status: DataStatus;

  // 관계 설정
  @ManyToOne(() => Garage, { nullable: false })
  @JoinColumn({ name: 'garage_id' })
  garage: Garage;
}
