import { Expose } from 'class-transformer';
import { ChauffeurStatus } from '@/domain/enum/chauffeur-status.enum';
import { ChauffeurType } from '@/domain/enum/chauffeur-type.enum';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { UserRoleType } from '@/domain/enum/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ChauffeurResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  phone: string;

  @ApiProperty()
  @Expose()
  birthDate: string;

  @ApiProperty()
  @Expose()
  type: ChauffeurType;

  @ApiProperty()
  @Expose()
  chauffeurStatus: ChauffeurStatus;

  @ApiProperty()
  @Expose()
  vehicleId: number | null;

  @ApiProperty()
  @Expose()
  role: UserRoleType;

  @ApiProperty()
  @Expose()
  status: DataStatus;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
