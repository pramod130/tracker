import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active tasks for user' })
  async getAllTasks(@GetUser('id') userId: string) {
    return this.tasksService.getAllTasks(userId);
  }

  @Get('today')
  @ApiOperation({ summary: "Get today's tasks with completion status" })
  async getTodayTasks(@GetUser('id') userId: string) {
    return this.tasksService.getTodayTasks(userId);
  }

  @Get('matrix')
  @ApiOperation({ summary: 'Get 5-day task completion matrix (Y-axis tasks, X-axis 5 days)' })
  async get5DayTaskMatrix(@GetUser('id') userId: string) {
    return this.tasksService.get5DayTaskMatrix(userId);
  }

  @Get('templates')
  @ApiOperation({ summary: 'Get system task templates' })
  async getTemplates() {
    return this.tasksService.getTemplates();
  }

  @Post('templates/:id/add')
  @ApiOperation({ summary: 'Add a task from template with 1 tap' })
  async addFromTemplate(
    @GetUser('id') userId: string,
    @Param('id') templateId: string,
  ) {
    return this.tasksService.addFromTemplate(userId, templateId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new custom task' })
  async createTask(@GetUser('id') userId: string, @Body() dto: CreateTaskDto) {
    return this.tasksService.createTask(userId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  async getTaskById(@GetUser('id') userId: string, @Param('id') taskId: string) {
    return this.tasksService.getTaskById(userId, taskId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update existing task' })
  async updateTask(
    @GetUser('id') userId: string,
    @Param('id') taskId: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.updateTask(userId, taskId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete / deactivate task' })
  async deleteTask(@GetUser('id') userId: string, @Param('id') taskId: string) {
    return this.tasksService.deleteTask(userId, taskId);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Mark task as complete for today (or optional date)' })
  async completeTask(
    @GetUser('id') userId: string,
    @Param('id') taskId: string,
    @Body('date') date?: string,
  ) {
    return this.tasksService.completeTask(userId, taskId, date);
  }

  @Post(':id/uncomplete')
  @ApiOperation({ summary: 'Uncomplete a task' })
  async uncompleteTask(
    @GetUser('id') userId: string,
    @Param('id') taskId: string,
    @Body('date') date?: string,
  ) {
    return this.tasksService.uncompleteTask(userId, taskId, date);
  }
}
