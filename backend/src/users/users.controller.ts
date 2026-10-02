import { Body, Controller, Delete, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('User')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  async getProfile(@GetUser('id') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update user profile and preferences' })
  async updateProfile(@GetUser('id') userId: string, @Body() data: any) {
    return this.usersService.updateProfile(userId, data);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Delete user account' })
  async deleteAccount(@GetUser('id') userId: string) {
    return this.usersService.deleteAccount(userId);
  }

  @Get('preferences')
  @ApiOperation({ summary: 'Get user preferences' })
  async getPreferences(@GetUser('id') userId: string) {
    return this.usersService.getPreferences(userId);
  }

  @Patch('preferences')
  @ApiOperation({ summary: 'Update user preferences' })
  async updatePreferences(@GetUser('id') userId: string, @Body() data: any) {
    return this.usersService.updatePreferences(userId, data);
  }
}
