import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Story, StoryDocument } from "../schemas/story.schema";
import { BaseRepository } from "../../../common/interfaces/base-repository.interface";

@Injectable()
export class StoryRepository implements BaseRepository<Story> {
  constructor(
    @InjectModel(Story.name) private storyModel: Model<StoryDocument>,
  ) {}

  async create(story: Partial<Story>): Promise<Story> {
    const createdStory = new this.storyModel(story);
    return createdStory.save();
  }

  async findAll(): Promise<Story[]> {
    return this.storyModel.find().populate("projectId ownerId").exec();
  }

  async findById(id: string): Promise<Story | null> {
    return this.storyModel.findById(id).populate("projectId ownerId").exec();
  }

  async update(id: string, story: Partial<Story>): Promise<Story | null> {
    return this.storyModel
      .findByIdAndUpdate(id, story, { new: true })
      .populate("projectId ownerId")
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.storyModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async findByProjectId(projectId: string): Promise<Story[]> {
    return this.storyModel
      .find({ projectId })
      .populate("projectId ownerId")
      .exec();
  }

  async findByOwnerId(ownerId: string): Promise<Story[]> {
    return this.storyModel
      .find({ ownerId })
      .populate("projectId ownerId")
      .exec();
  }

  async findByStatus(status: string): Promise<Story[]> {
    return this.storyModel
      .find({ status })
      .populate("projectId ownerId")
      .exec();
  }
}
