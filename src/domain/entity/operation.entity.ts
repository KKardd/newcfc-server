import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '@/domain/entity/base.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { OperationType } from '@/domain/enum/operation-type.enum';

@Entity('operation')
export class Operation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: OperationType })
  type: OperationType;

  @Column({ name: 'is_repeated', type: 'boolean', default: false })
  isRepeated: boolean;

  @Column({ name: 'start_time', type: 'timestamp', nullable: true })
  startTime: Date | null;

  @Column({ name: 'end_time', type: 'timestamp', nullable: true })
  endTime: Date | null;

  @Column({ name: 'distance', type: 'float', nullable: true })
  distance: number | null;

  @Column({ name: 'chauffeur_id', type: 'integer', nullable: true })
  chauffeurId: number | null;

  @Column({ name: 'vehicle_id', type: 'integer', nullable: true })
  vehicleId: number | null;

  @Column({ name: 'real_time_dispatch_id', type: 'integer', nullable: true })
  realTimeDispatchId: number | null;

  @Column({ name: 'manager_name', type: 'varchar', length: 100, nullable: true })
  managerName: string | null;

  @Column({ name: 'manager_number', type: 'varchar', length: 20, nullable: true })
  managerNumber: string | null;

  @Column({ name: 'additional_costs', type: 'jsonb', nullable: true })
  additionalCosts: Record<string, number> | null;

  @Column({ name: 'receipt_image_urls', type: 'jsonb', nullable: true })
  receiptImageUrls: string[] | null;

  @Column({ name: 'kakao_path', type: 'jsonb', nullable: true })
  kakaoPath: any;

  @Column({ type: 'enum', enum: DataStatus, default: DataStatus.REGISTER })
  status: DataStatus;
}
