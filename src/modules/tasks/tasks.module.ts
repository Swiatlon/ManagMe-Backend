import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TaskService } from "./services/task.service";
import { TaskController } from "./controllers/task.controller";
import { TaskRepository } from "./repositories/task.repository";
import { Task, TaskSchema } from "./schemas/task.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository],
  exports: [TaskService, TaskRepository],
})
export class TasksModule {}
