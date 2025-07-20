import { Controller, Get, Put, Query, UseGuards, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { SearchNotificationDto } from '@/adapter/inbound/dto/request/notification/search-notification.dto';
import { NotificationResponseDto } from '@/adapter/inbound/dto/response/notification/notification-response.dto';
import { ApiSuccessResponse } from '@/adapter/inbound/dto/swagger.decorator';
import { UserRoleType } from '@/domain/enum/user-role.enum';
import { NotificationHistoryServiceInPort } from '@/port/inbound/notification-history-service.in-port';
import { JwtAuthGuard } from '@/security/guard/jwt-auth.guard';
import { Roles } from '@/security/guard/user-role.decorator';
import { UserRolesGuard } from '@/security/guard/user-role.guard';
import { UserToken } from '@/security/jwt/user-token.decorator';
import { UserAccessTokenPayload } from '@/security/jwt/token.payload';

@ApiTags('Notification')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(JwtAuthGuard, UserRolesGuard)
export class NotificationController {
  constructor(private readonly notificationHistoryService: NotificationHistoryServiceInPort) {}

  @ApiOperation({ 
    summary: '내 알림 목록 조회',
    description: '로그인한 사용자의 모든 알림 목록을 조회합니다. 조회 시 읽지 않은 알림들이 자동으로 읽음 처리됩니다.'
  })
  @ApiSuccessResponse(200, NotificationResponseDto, { isArray: true })
  @Roles(UserRoleType.CHAUFFEUR, UserRoleType.SUPER_ADMIN, UserRoleType.SUB_ADMIN)
  @Get('me')
  async getMyNotifications(
    @UserToken() user: UserAccessTokenPayload,
    @Query() search: SearchNotificationDto,
  ): Promise<NotificationResponseDto[]> {
    // 사용자 타입 결정
    let userType: string;
    if (user.roles.includes(UserRoleType.CHAUFFEUR)) {
      userType = 'CHAUFFEUR';
    } else if (user.roles.includes(UserRoleType.SUPER_ADMIN) || user.roles.includes(UserRoleType.SUB_ADMIN)) {
      userType = 'ADMIN';
    } else {
      userType = 'USER';
    }

    return await this.notificationHistoryService.getMyNotifications(user.userId, userType, search);
  }

  @ApiOperation({ 
    summary: '내 알림 읽음 처리',
    description: '특정 알림들을 읽음 처리합니다. notificationIds를 제공하지 않으면 모든 읽지 않은 알림을 읽음 처리합니다.'
  })
  @Roles(UserRoleType.CHAUFFEUR, UserRoleType.SUPER_ADMIN, UserRoleType.SUB_ADMIN)
  @Put('me/mark-read')
  async markAsRead(
    @UserToken() user: UserAccessTokenPayload,
    @Body() body: { notificationIds?: number[] },
  ): Promise<void> {
    // 사용자 타입 결정
    let userType: string;
    if (user.roles.includes(UserRoleType.CHAUFFEUR)) {
      userType = 'CHAUFFEUR';
    } else if (user.roles.includes(UserRoleType.SUPER_ADMIN) || user.roles.includes(UserRoleType.SUB_ADMIN)) {
      userType = 'ADMIN';
    } else {
      userType = 'USER';
    }

    await this.notificationHistoryService.markAsRead(user.userId, userType, body.notificationIds);
  }
}