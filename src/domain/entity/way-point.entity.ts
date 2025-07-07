import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '@/domain/entity/base.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { ChauffeurStatus } from '@/domain/enum/chauffeur-status.enum';

@Entity('way_point')
export class WayPoint extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'operation_id', type: 'integer', nullable: true })
  operationId: number;

  @Column({ name: 'chauffeur_status', type: 'enum', enum: ChauffeurStatus, nullable: true })
  chauffeurStatus: ChauffeurStatus | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  name: string | null;

  @Column({ type: 'varchar', length: 255, nullable: false })
  address: string;

  @Column({ name: 'address_detail', type: 'varchar', length: 255, nullable: true })
  addressDetail: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number | null;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number | null;

  @Column({ name: 'visit_time', type: 'timestamp', nullable: true })
  visitTime: Date | null;

  @Column({ type: 'integer', nullable: false })
  order: number;

  @Column({ type: 'enum', enum: DataStatus, default: DataStatus.REGISTER })
  status: DataStatus;
}
