import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProjectController } from "./controllers/projects.controller";
import { ProjectRepository } from "./repositories/projects.repository";
import { Project, ProjectSchema } from "./schemas/projects.schema";
import { ProjectService } from "./services/projects.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepository],
  exports: [ProjectService, ProjectRepository],
})
export class ProjectsModule {}
