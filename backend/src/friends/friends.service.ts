import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FriendsService {
  constructor(private prisma: PrismaService) {}

  async getFriends(userId: string) {
    const friendRelations = await this.prisma.friend.findMany({
      where: {
        OR: [
          { requesterId: userId, status: 'ACCEPTED' },
          { addresseeId: userId, status: 'ACCEPTED' },
        ],
      },
      include: {
        requester: { select: { id: true, name: true, profileImage: true, currentStreak: true, level: true } },
        addressee: { select: { id: true, name: true, profileImage: true, currentStreak: true, level: true } },
      },
    });

    return friendRelations.map((f) => {
      const friendUser = f.requesterId === userId ? f.addressee : f.requester;
      return {
        friendshipId: f.id,
        user: friendUser,
        since: f.updatedAt,
      };
    });
  }

  async sendFriendRequest(requesterId: string, addresseeEmail: string) {
    const addressee = await this.prisma.user.findUnique({
      where: { email: addresseeEmail.toLowerCase() },
    });

    if (!addressee) {
      throw new NotFoundException('User with this email not found');
    }

    if (addressee.id === requesterId) {
      throw new ConflictException('You cannot send a friend request to yourself');
    }

    const existing = await this.prisma.friend.findFirst({
      where: {
        OR: [
          { requesterId, addresseeId: addressee.id },
          { requesterId: addressee.id, addresseeId: requesterId },
        ],
      },
    });

    if (existing) {
      throw new ConflictException('Friend request or friendship already exists');
    }

    return this.prisma.friend.create({
      data: {
        requesterId,
        addresseeId: addressee.id,
        status: 'PENDING',
      },
    });
  }

  async acceptFriendRequest(userId: string, requestId: string) {
    const friendRequest = await this.prisma.friend.findUnique({
      where: { id: requestId },
    });

    if (!friendRequest || friendRequest.addresseeId !== userId) {
      throw new NotFoundException('Friend request not found');
    }

    return this.prisma.friend.update({
      where: { id: requestId },
      data: { status: 'ACCEPTED' },
    });
  }

  async removeFriend(userId: string, friendshipId: string) {
    const friendRelation = await this.prisma.friend.findUnique({
      where: { id: friendshipId },
    });

    if (!friendRelation || (friendRelation.requesterId !== userId && friendRelation.addresseeId !== userId)) {
      throw new NotFoundException('Friendship not found');
    }

    await this.prisma.friend.delete({ where: { id: friendshipId } });
    return { message: 'Friend removed' };
  }
}
