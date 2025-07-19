import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '@/domain/entity/base.entity';
import { ChauffeurStatus } from '@/domain/enum/chauffeur-status.enum';
import { ChauffeurType } from '@/domain/enum/chauffeur-type.enum';
import { DataStatus } from '@/domain/enum/data-status.enum';
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

  @Column({ name: 'birth_date', type: 'varchar', length: 6, nullable: false })
  birthDate: string;

  @Column({ name: 'profile_image_url', type: 'varchar', length: 500, nullable: true })
  profileImageUrl: string | null;

  @Column({ type: 'enum', enum: ChauffeurType, nullable: true })
  type: ChauffeurType | null;

  @Column({ name: 'is_vehicle_assigned', type: 'boolean', default: false })
  isVehicleAssigned: boolean;

  @Column({ name: 'chauffeur_status', type: 'enum', enum: ChauffeurStatus, default: ChauffeurStatus.OFF_DUTY })
  chauffeurStatus: ChauffeurStatus;

  @Column({ name: 'vehicle_id', type: 'integer', nullable: true })
  vehicleId: number | null;

  @Column({ name: 'real_time_dispatch_id', type: 'integer', nullable: true })
  realTimeDispatchId: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number | null;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number | null;

  @Column({ type: 'enum', enum: UserRoleType, default: UserRoleType.CHAUFFEUR })
  role: UserRoleType;

  @Column({ name: 'fcm_token', type: 'varchar', length: 500, nullable: true })
  fcmToken: string | null;

  @Column({ type: 'enum', enum: DataStatus, default: DataStatus.REGISTER })
  status: DataStatus;
}
