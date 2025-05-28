import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { StoryService } from "./services/story.service";
import { StoryController } from "./controllers/story.controller";
import { StoryRepository } from "./repositories/story.repository";
import { Story, StorySchema } from "./schemas/story.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Story.name, schema: StorySchema }]),
  ],
  controllers: [StoryController],
  providers: [StoryService, StoryRepository],
  exports: [StoryService, StoryRepository],
})
export class StoriesModule {}
