import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  async markAsRead(userId: string, notificationId?: string) {
    if (notificationId) {
      return this.prisma.notification.updateMany({
        where: { id: notificationId, userId },
        data: { isRead: true },
      });
    }

    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async createNotification(userId: string, title: string, message: string, type = 'TASK_REMINDER') {
    return this.prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
      },
    });
  }
}
