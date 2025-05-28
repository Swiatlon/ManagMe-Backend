import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { TaskService } from "../services/task.service";
import { CreateTaskDto } from "../dto/create-task.dto";
import { UpdateTaskDto } from "../dto/update-task.dto";

@Controller("tasks")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  findAll(
    @Query("storyId") storyId?: string,
    @Query("assignedUserId") assignedUserId?: string,
    @Query("status") status?: string,
  ) {
    if (storyId) {
      return this.taskService.findByStoryId(storyId);
    }
    if (assignedUserId) {
      return this.taskService.findByAssignedUserId(assignedUserId);
    }
    if (status) {
      return this.taskService.findByStatus(status);
    }
    return this.taskService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.taskService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(id, updateTaskDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.taskService.remove(id);
  }
}
