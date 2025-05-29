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
    return this.taskModel.find().populate("story assignedUser").exec();
  }

  async findById(id: string): Promise<Task | null> {
    return this.taskModel.findById(id).populate("story assignedUser").exec();
  }

  async update(id: string, task: Partial<Task>): Promise<Task | null> {
    return this.taskModel
      .findByIdAndUpdate(id, task, { new: true })
      .populate("story assignedUser")
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.taskModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async findByStoryId(storyId: string): Promise<Task[]> {
    return this.taskModel
      .find({ storyId })
      .populate("story assignedUser")
      .exec();
  }

  async findByAssignedUserId(assignedUserId: string): Promise<Task[]> {
    return this.taskModel
      .find({ assignedUserId })
      .populate("story assignedUser")
      .exec();
  }

  async findByStatus(status: string): Promise<Task[]> {
    return this.taskModel
      .find({ status })
      .populate("story assignedUser")
      .exec();
  }

  async completeTask(id: string): Promise<Task | null> {
    return this.taskModel
      .findByIdAndUpdate(
        id,
        {
          status: "done",
          updatedAt: new Date(),
          endDate: new Date(),
          completedAt: new Date(),
        },
        { new: true },
      )
      .populate("story assignedUser")
      .exec();
  }
}
