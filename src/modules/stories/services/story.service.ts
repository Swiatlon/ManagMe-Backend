import { Injectable, NotFoundException } from "@nestjs/common";
import { StoryRepository } from "../repositories/story.repository";
import { CreateStoryDto } from "../dto/create-story.dto";
import { UpdateStoryDto } from "../dto/update-story.dto";
import { Story } from "../schemas/story.schema";
import { Types } from "mongoose";

@Injectable()
export class StoryService {
  constructor(private readonly storyRepository: StoryRepository) {}

  async create(createStoryDto: CreateStoryDto): Promise<Story> {
    const storyData = {
      name: createStoryDto.name,
      description: createStoryDto.description,
      priority: createStoryDto.priority,
      status: createStoryDto.status,
      projectId: new Types.ObjectId(createStoryDto.projectId),
      ownerId: new Types.ObjectId(createStoryDto.ownerId),
    };

    return this.storyRepository.create(storyData);
  }

  async findAll(): Promise<Story[]> {
    return this.storyRepository.findAll();
  }

  async findOne(id: string): Promise<Story> {
    const story = await this.storyRepository.findById(id);
    if (!story) {
      throw new NotFoundException(`Story with ID ${id} not found`);
    }
    return story;
  }

  async update(id: string, updateStoryDto: UpdateStoryDto): Promise<Story> {
    const storyData = {
      name: updateStoryDto.name,
      description: updateStoryDto.description,
      priority: updateStoryDto.priority,
      status: updateStoryDto.status,
      projectId: new Types.ObjectId(updateStoryDto.projectId),
      ownerId: new Types.ObjectId(updateStoryDto.ownerId),
    };

    const story = await this.storyRepository.update(id, storyData);

    if (!story) {
      throw new NotFoundException(`Story with ID ${id} not found`);
    }

    return story;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.storyRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Story with ID ${id} not found`);
    }
  }

  async findByProjectId(projectId: string): Promise<Story[]> {
    return this.storyRepository.findByProjectId(projectId);
  }

  async findByOwnerId(ownerId: string): Promise<Story[]> {
    return this.storyRepository.findByOwnerId(ownerId);
  }

  async findByStatus(status: string): Promise<Story[]> {
    return this.storyRepository.findByStatus(status);
  }
}
