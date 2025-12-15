import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { NotificationService } from '../services/notification.service';
import { NotificationResponseDto, NotificationQueryDto, MarkReadDto } from '../dto/notification.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserData } from '../../auth/decorators/current-user.decorator';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'Get notifications for current user' })
  @ApiQuery({ name: 'isRead', required: false, type: Boolean })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of notifications', type: [NotificationResponseDto] })
  async getMyNotifications(
    @CurrentUser() user: CurrentUserData,
    @Query() query: NotificationQueryDto,
  ): Promise<NotificationResponseDto[]> {
    return this.notificationService.findByUser(user.userId, query);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notification count' })
  @ApiResponse({ status: 200, description: 'Unread count' })
  async getUnreadCount(@CurrentUser() user: CurrentUserData): Promise<{ count: number }> {
    const count = await this.notificationService.getUnreadCount(user.userId);
    return { count };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  async markAsRead(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserData,
  ): Promise<{ message: string }> {
    await this.notificationService.markAsRead(id, user.userId);
    return { message: 'Notification marked as read' };
  }

  @Post('mark-read')
  @ApiOperation({ summary: 'Mark multiple notifications as read' })
  @ApiResponse({ status: 200, description: 'Notifications marked as read' })
  async markMultipleAsRead(
    @Body() dto: MarkReadDto,
    @CurrentUser() user: CurrentUserData,
  ): Promise<{ message: string }> {
    await this.notificationService.markMultipleAsRead(dto.notificationIds, user.userId);
    return { message: 'Notifications marked as read' };
  }

  @Post('mark-all-read')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  async markAllAsRead(@CurrentUser() user: CurrentUserData): Promise<{ message: string }> {
    await this.notificationService.markAllAsRead(user.userId);
    return { message: 'All notifications marked as read' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiResponse({ status: 200, description: 'Notification deleted' })
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserData,
  ): Promise<{ message: string }> {
    await this.notificationService.delete(id, user.userId);
    return { message: 'Notification deleted' };
  }
}





