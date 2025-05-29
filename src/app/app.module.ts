import { AuthModule } from "@/modules/auth/auth.module";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { getDatabaseConfig } from "src/configs/database.config";
import { ProjectsModule } from "src/modules/projects/projects.module";
import { StoriesModule } from "src/modules/stories/stories.module";
import { TasksModule } from "src/modules/tasks/tasks.module";
import { UsersModule } from "src/modules/users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    AuthModule,
    UsersModule,
    ProjectsModule,
    StoriesModule,
    TasksModule,
  ],
})
export class AppModule {}
