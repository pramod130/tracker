import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { GoalCategory, DifficultyPreference } from '../../common/enums';

export class RegisterDto {
  @ApiProperty({ example: 'Alex Mercer' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'alex@winterarc.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: GoalCategory, required: false, example: GoalCategory.FITNESS })
  @IsEnum(GoalCategory)
  @IsOptional()
  goalCategory?: GoalCategory;

  @ApiProperty({ enum: DifficultyPreference, required: false, example: DifficultyPreference.NORMAL })
  @IsEnum(DifficultyPreference)
  @IsOptional()
  difficultyPreference?: DifficultyPreference;
}
