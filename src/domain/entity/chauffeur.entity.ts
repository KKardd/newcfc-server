import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '@/domain/entity/base.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { ChauffeurStatus } from '@/domain/enum/chauffeur-status.enum';
import { ChauffeurType } from '@/domain/enum/chauffeur-type.enum';
import { UserRoleType } from '@/domain/enum/user-role.enum';

@Entity('chauffeur')
export class Chauffeur extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  @Index()
  phone: string;

  @Column({ name: 'birth_date', type: 'varchar', length: 8, nullable: false })
  birthDate: string;

  @Column({ type: 'enum', enum: ChauffeurType })
  type: ChauffeurType;

  @Column({ name: 'chauffeur_status', type: 'enum', enum: ChauffeurStatus, default: ChauffeurStatus.OFF_DUTY })
  chauffeurStatus: ChauffeurStatus;

  @Column({ name: 'vehicle_id', type: 'integer', nullable: true })
  vehicleId: number | null;

  @Column({ type: 'enum', enum: UserRoleType, default: UserRoleType.CHAUFFEUR })
  role: UserRoleType;

  @Column({ type: 'enum', enum: DataStatus, default: DataStatus.REGISTER })
  status: DataStatus;
}
