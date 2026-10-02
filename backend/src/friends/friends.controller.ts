import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FriendsService } from './friends.service';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Friends')
@ApiBearerAuth()
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of friends' })
  async getFriends(@GetUser('id') userId: string) {
    return this.friendsService.getFriends(userId);
  }

  @Post('request')
  @ApiOperation({ summary: 'Send friend request by email' })
  async sendFriendRequest(
    @GetUser('id') userId: string,
    @Body('email') email: string,
  ) {
    return this.friendsService.sendFriendRequest(userId, email);
  }

  @Post(':id/accept')
  @ApiOperation({ summary: 'Accept a pending friend request' })
  async acceptFriendRequest(
    @GetUser('id') userId: string,
    @Param('id') requestId: string,
  ) {
    return this.friendsService.acceptFriendRequest(userId, requestId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a friend' })
  async removeFriend(
    @GetUser('id') userId: string,
    @Param('id') friendshipId: string,
  ) {
    return this.friendsService.removeFriend(userId, friendshipId);
  }
}
