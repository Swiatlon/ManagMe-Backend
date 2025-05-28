import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "../users/users.module";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
import { AuthController } from "./controller/auth.controller";
import { AuthService } from "./services/auth.service";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({}), // Configuration is handled in strategies
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
