import { UserResponseDto } from '@/adapter/inbound/dto/response/user/user-response.dto';

export abstract class UserServiceInPort {
  abstract getById(userId: number, tenantId: number): Promise<UserResponseDto>;
}
