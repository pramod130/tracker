import { Body, Controller, Get, Patch, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user in-app notifications' })
  async getUserNotifications(@GetUser('id') userId: string) {
    return this.notificationsService.getUserNotifications(userId);
  }

  @Patch('read')
  @ApiOperation({ summary: 'Mark notifications as read' })
  async markAsRead(@GetUser('id') userId: string, @Body('id') id?: string) {
    return this.notificationsService.markAsRead(userId, id);
  }
}
