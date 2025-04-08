import { User } from '@/domain/entity/user.entity';
import { UserLifecycle } from '@/domain/enum/user-life-cycle.enum';

export abstract class UserServiceOutPort {
  abstract getStatusById(userId: number, tenantId: number, userLifecycle: UserLifecycle): Promise<User | null>;
}
