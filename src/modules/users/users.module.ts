import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserRepository } from "./repositories/user.repository";
import { User, UserSchema } from "./schemas/user.schema";
import { UsersController } from "./controllers/user.controller";
import { UsersService } from "./services/user.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
})
export class UsersModule {}
