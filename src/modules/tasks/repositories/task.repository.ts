import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Task, TaskDocument } from "../schemas/task.schema";
import { BaseRepository } from "../../../common/interfaces/base-repository.interface";

@Injectable()
export class TaskRepository implements BaseRepository<Task> {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(task: Partial<Task>): Promise<Task> {
    const createdTask = new this.taskModel(task);
    return createdTask.save();
  }

  async findAll(): Promise<Task[]> {
    return this.taskModel.find().populate("storyId assignedUserId").exec();
  }

  async findById(id: string): Promise<Task | null> {
    return this.taskModel
      .findById(id)
      .populate("storyId assignedUserId")
      .exec();
  }

  async update(id: string, task: Partial<Task>): Promise<Task | null> {
    return this.taskModel
      .findByIdAndUpdate(id, task, { new: true })
      .populate("storyId assignedUserId")
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.taskModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async findByStoryId(storyId: string): Promise<Task[]> {
    return this.taskModel
      .find({ storyId })
      .populate("storyId assignedUserId")
      .exec();
  }

  async findByAssignedUserId(assignedUserId: string): Promise<Task[]> {
    return this.taskModel
      .find({ assignedUserId })
      .populate("storyId assignedUserId")
      .exec();
  }

  async findByStatus(status: string): Promise<Task[]> {
    return this.taskModel
      .find({ status })
      .populate("storyId assignedUserId")
      .exec();
  }
}
