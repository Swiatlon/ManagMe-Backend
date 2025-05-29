import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
} from "class-validator";
import { TaskPriority } from "../../../common/enums/task-priority.enum";
import { TaskStatus } from "../../../common/enums/task-status.enum";

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @IsMongoId()
  storyId: string;

  @IsNumber()
  estimatedHours: number;

  @IsEnum(TaskStatus)
  status: TaskStatus = TaskStatus.Todo;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  assignedUserId?: string;
}
