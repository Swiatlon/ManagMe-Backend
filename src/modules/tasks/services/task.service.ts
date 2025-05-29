import { Injectable, NotFoundException } from "@nestjs/common";
import { TaskRepository } from "../repositories/task.repository";
import { CreateTaskDto } from "../dto/create-task.dto";
import { UpdateTaskDto } from "../dto/update-task.dto";
import { Task } from "../schemas/task.schema";
import { Types } from "mongoose";

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const taskData = {
      name: createTaskDto.name,
      description: createTaskDto.description,
      priority: createTaskDto.priority,
      status: createTaskDto.status,
      story: new Types.ObjectId(createTaskDto.storyId),
      assignedUser: createTaskDto.assignedUserId
        ? new Types.ObjectId(createTaskDto.assignedUserId)
        : undefined,
      estimatedHours: createTaskDto.estimatedHours,
      createdAt: new Date(),
      updatedAt: new Date(),
      startDate: createTaskDto.startDate,
      endDate: createTaskDto.endDate,
    };

    return this.taskRepository.create(taskData);
  }

  async findAll(): Promise<Task[]> {
    return this.taskRepository.findAll();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const taskData = {
      name: updateTaskDto.name,
      description: updateTaskDto.description,
      priority: updateTaskDto.priority,
      status: updateTaskDto.status,
      storyId: new Types.ObjectId(updateTaskDto.storyId),
      assignedUser: new Types.ObjectId(updateTaskDto.assignedUserId),
      estimatedHours: updateTaskDto.estimatedHours,
      createdAt: new Date(),
      updatedAt: new Date(),
      startDate: updateTaskDto.startDate,
      endDate: updateTaskDto.endDate,
    };

    const task = await this.taskRepository.update(id, taskData);

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.taskRepository.delete(id);

    if (!deleted) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async findByStoryId(storyId: string): Promise<Task[]> {
    return this.taskRepository.findByStoryId(storyId);
  }

  async findByAssignedUserId(assignedUserId: string): Promise<Task[]> {
    return this.taskRepository.findByAssignedUserId(assignedUserId);
  }

  async findByStatus(status: string): Promise<Task[]> {
    return this.taskRepository.findByStatus(status);
  }

  async completeTask(id: string): Promise<Task> {
    const task = await this.taskRepository.completeTask(id);

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }
}
