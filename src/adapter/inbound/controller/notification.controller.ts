import { Controller, Get, Put, Query, UseGuards, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { SearchNotificationDto } from '@/adapter/inbound/dto/request/notification/search-notification.dto';
import { NotificationResponseDto } from '@/adapter/inbound/dto/response/notification/notification-response.dto';
import { HasUnreadResponseDto } from '@/adapter/inbound/dto/response/notification/has-unread-response.dto';
import { ApiSuccessResponse } from '@/adapter/inbound/dto/swagger.decorator';
import { UserRoleType } from '@/domain/enum/user-role.enum';
import { NotificationHistoryServiceInPort } from '@/port/inbound/notification-history-service.in-port';
import { JwtAuthGuard } from '@/security/guard/jwt-auth.guard';
import { Roles } from '@/security/guard/user-role.decorator';
import { UserRolesGuard } from '@/security/guard/user-role.guard';
import { UserAccessTokenPayload } from '@/security/jwt/token.payload';
import { UserToken } from '@/security/jwt/user-token.decorator';

@ApiTags('Notification')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(JwtAuthGuard, UserRolesGuard)
export class NotificationController {
  constructor(private readonly notificationHistoryService: NotificationHistoryServiceInPort) {}

  @ApiOperation({
    summary: '내 알림 목록 조회',
    description: '로그인한 사용자의 모든 알림 목록을 조회합니다. 조회 시 읽지 않은 알림들이 자동으로 읽음 처리됩니다.',
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
    summary: '읽지 않은 알림 존재 여부 확인',
    description: '로그인한 사용자에게 읽지 않은 알림이 있는지 확인합니다.',
  })
  @ApiSuccessResponse(200, HasUnreadResponseDto)
  @Roles(UserRoleType.CHAUFFEUR, UserRoleType.SUPER_ADMIN, UserRoleType.SUB_ADMIN)
  @Get('me/has-unread')
  async hasUnreadNotifications(@UserToken() user: UserAccessTokenPayload): Promise<{ hasUnread: boolean }> {
    // 사용자 타입 결정
    let userType: string;
    if (user.roles.includes(UserRoleType.CHAUFFEUR)) {
      userType = 'CHAUFFEUR';
    } else if (user.roles.includes(UserRoleType.SUPER_ADMIN) || user.roles.includes(UserRoleType.SUB_ADMIN)) {
      userType = 'ADMIN';
    } else {
      userType = 'USER';
    }

    const hasUnread = await this.notificationHistoryService.hasUnreadNotifications(user.userId, userType);
    return { hasUnread };
  }

  @ApiOperation({
    summary: '내 알림 읽음 처리',
    description: '특정 알림들을 읽음 처리합니다. notificationIds를 제공하지 않으면 모든 읽지 않은 알림을 읽음 처리합니다.',
  })
  @Roles(UserRoleType.CHAUFFEUR, UserRoleType.SUPER_ADMIN, UserRoleType.SUB_ADMIN)
  @Put('me/mark-read')
  async markAsRead(@UserToken() user: UserAccessTokenPayload, @Body() body: { notificationIds?: number[] }): Promise<void> {
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
