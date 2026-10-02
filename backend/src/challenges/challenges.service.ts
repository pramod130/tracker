import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChallengesService {
  constructor(private prisma: PrismaService) {}

  async getAllChallenges() {
    return this.prisma.challenge.findMany({
      include: {
        _count: { select: { participants: true } },
      },
      orderBy: { startDate: 'desc' },
    });
  }

  async getChallengeById(id: string, userId?: string) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id },
      include: {
        participants: {
          include: { user: { select: { id: true, name: true, profileImage: true, level: true } } },
        },
      },
    });

    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    const isJoined = userId
      ? challenge.participants.some((p) => p.userId === userId)
      : false;

    return { ...challenge, isJoined };
  }

  async createChallenge(creatorId: string, data: any) {
    const challenge = await this.prisma.challenge.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category || 'PERSONAL',
        targetCount: data.targetCount || 28,
        xpReward: data.xpReward || 100,
        startDate: new Date(data.startDate || Date.now()),
        endDate: new Date(data.endDate || Date.now() + 7 * 86400000),
        icon: data.icon || 'trophy',
        creatorId,
      },
    });

    // Auto-join creator
    await this.joinChallenge(challenge.id, creatorId);

    return challenge;
  }

  async joinChallenge(challengeId: string, userId: string) {
    const challenge = await this.prisma.challenge.findUnique({ where: { id: challengeId } });
    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    const existing = await this.prisma.challengeParticipant.findUnique({
      where: { challengeId_userId: { challengeId, userId } },
    });

    if (existing) {
      throw new ConflictException('Already joined this challenge');
    }

    return this.prisma.challengeParticipant.create({
      data: {
        challengeId,
        userId,
        progress: 0,
      },
    });
  }
}
