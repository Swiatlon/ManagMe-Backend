import { UsersService } from "@/modules/users/services/user.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "../dto/login.dto";
import { RegisterDto } from "../dto/register.dto";
import * as bcrypt from "bcrypt";
import {
  AuthResponse,
  RefreshPayload,
  JwtPayload,
} from "../interfaces/auth.interface";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const user = await this.usersService.create(registerDto);

    const tokens = await this.generateTokens({
      sub: user._id as string,
      identifier: user.identifier,
      role: user.role,
    });

    await this.usersService.updateRefreshToken(
      user._id as string,
      await this.hashToken(tokens.refreshToken),
    );

    return {
      ...tokens,
      user: {
        id: user._id as string,
        identifier: user.identifier,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.validateUser(
      loginDto.identifier,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const tokens = await this.generateTokens({
      sub: user.id,
      identifier: user.identifier,
      role: user.role,
    });

    await this.usersService.updateRefreshToken(
      user.id,
      await this.hashToken(tokens.refreshToken),
    );

    return {
      ...tokens,
      user: {
        id: user.id,
        identifier: user.identifier,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async refreshTokens(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      identifier: string;
      firstName: string;
      lastName: string;
      role: string;
    };
  }> {
    try {
      const payload = this.jwtService.verify<RefreshPayload>(refreshToken, {
        secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
      });

      const user = await this.usersService.findById(payload.sub);

      if (!user?.refreshToken) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      const refreshTokenMatches = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );

      if (!refreshTokenMatches) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      const tokens = await this.generateTokens({
        sub: user._id as string,
        identifier: user.identifier,
        role: user.role,
      });

      await this.usersService.updateRefreshToken(
        user._id as string,
        await this.hashToken(tokens.refreshToken),
      );

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          id: user._id as string,
          identifier: user.identifier,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      };
    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.updateRefreshToken(userId, null);
  }

  async validateUser(identifier: string, password: string) {
    const user = await this.usersService.findByIdentifier(identifier);

    if (!user) {
      return null;
    }

    const isPasswordValid = await this.usersService.validatePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return null;
    }

    return {
      id: user._id as string,
      identifier: user.identifier,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }

  private async generateTokens(payload: JwtPayload) {
    const accessTokenExpiration = this.configService.get<string>(
      "JWT_ACCESS_EXPIRATION_LONG",
    );

    const refreshTokenExpiration = this.configService.get<string>(
      "JWT_REFRESH_EXPIRATION_LONG",
    );

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>("JWT_ACCESS_SECRET"),
        expiresIn: accessTokenExpiration,
      }),
      this.jwtService.signAsync(
        { sub: payload.sub, identifier: payload.identifier },
        {
          secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
          expiresIn: refreshTokenExpiration,
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private async hashToken(token: string): Promise<string> {
    return bcrypt.hash(token, 12);
  }
}
