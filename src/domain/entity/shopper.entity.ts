import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '@/domain/entity/base.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { ShopperStatus } from '@/domain/enum/shopper-status.enum';
import { ShopperType } from '@/domain/enum/shopper-type.enum';

@Entity('shopper')
export class Shopper extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  @Index()
  phone: string;

  @Column({ name: 'birth_date', type: 'varchar', length: 8, nullable: false })
  birthDate: string;

  @Column({ type: 'enum', enum: ShopperType })
  type: ShopperType;

  @Column({ name: 'shopper_status', type: 'enum', enum: ShopperStatus, default: ShopperStatus.OFF_DUTY })
  shopperStatus: ShopperStatus;

  @Column({ name: 'vehicle_id', type: 'integer', nullable: true })
  vehicleId: number | null;

  @Column({ type: 'enum', enum: DataStatus, default: DataStatus.REGISTER })
  status: DataStatus;
}
