import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '@/domain/entity/base.entity';
import { ChauffeurStatus } from '@/domain/enum/chauffeur-status.enum';

@Entity('schedule')
export class Schedule extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'operation_id', type: 'integer', nullable: false })
  @Index()
  operationId: number;

  @Column({ name: 'way_point_id', type: 'integer', nullable: false })
  @Index()
  wayPointId: number;

  @Column({ name: 'recorded_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  visitTime: Date;

  @Column({ name: 'chauffeur_status', type: 'enum', enum: ChauffeurStatus, nullable: false })
  chauffeurStatus: ChauffeurStatus;
}
