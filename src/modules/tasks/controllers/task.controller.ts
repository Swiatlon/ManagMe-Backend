import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  Put,
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
  findAll() {
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

  @Put(":id/complete")
  @HttpCode(HttpStatus.OK)
  completeTask(@Param("id") id: string) {
    return this.taskService.completeTask(id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.taskService.remove(id);
  }
}
