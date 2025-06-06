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
import { StoryService } from "../services/story.service";
import { CreateStoryDto } from "../dto/create-story.dto";
import { UpdateStoryDto } from "../dto/update-story.dto";

@Controller("stories")
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Post()
  create(@Body() createStoryDto: CreateStoryDto) {
    return this.storyService.create(createStoryDto);
  }

  @Get()
  findAll() {
    return this.storyService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.storyService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateStoryDto: UpdateStoryDto) {
    return this.storyService.update(id, updateStoryDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.storyService.remove(id);
  }
}
