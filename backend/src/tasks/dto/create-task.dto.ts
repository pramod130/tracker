import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { GoalCategory, TaskFrequency, TaskType } from '../../common/enums';

export class CreateTaskDto {
  @ApiProperty({ example: 'Workout' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Complete 45 minutes of exercise', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: TaskType, example: TaskType.DAILY_HABIT })
  @IsEnum(TaskType)
  @IsOptional()
  type?: TaskType;

  @ApiProperty({ enum: GoalCategory, example: GoalCategory.FITNESS })
  @IsEnum(GoalCategory)
  @IsOptional()
  category?: GoalCategory;

  @ApiProperty({ example: 'dumbbell', required: false })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({ enum: TaskFrequency, example: TaskFrequency.DAILY })
  @IsEnum(TaskFrequency)
  @IsOptional()
  frequency?: TaskFrequency;

  @ApiProperty({ example: [1, 2, 3, 4, 5], required: false })
  @IsArray()
  @IsOptional()
  daysOfWeek?: number[];

  @ApiProperty({ example: 1.0, required: false })
  @IsNumber()
  @IsOptional()
  targetValue?: number;

  @ApiProperty({ example: 'times', required: false })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiProperty({ example: 10, required: false })
  @IsNumber()
  @IsOptional()
  points?: number;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  reminderEnabled?: boolean;

  @ApiProperty({ example: '08:00', required: false })
  @IsString()
  @IsOptional()
  reminderTime?: string;
}
