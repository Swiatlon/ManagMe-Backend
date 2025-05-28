import { UsersService } from "@/modules/users/services/user.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "../dto/login.dto";
import { RefreshTokenDto } from "../dto/refresh.dto";
import { RegisterDto } from "../dto/register.dto";
import {
  AuthResponse,
  RefreshResponse,
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

    const tokens = await this.generateTokens(
      {
        sub: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      false,
    );

    await this.usersService.updateRefreshToken(
      user._id.toString(),
      await this.hashToken(tokens.refreshToken),
    );

    return {
      ...tokens,
      user: {
        id: user._id.toString(),
        email: user.email,
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

    const tokens = await this.generateTokens(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      loginDto.rememberMe || false,
    );

    await this.usersService.updateRefreshToken(
      user.id,
      await this.hashToken(tokens.refreshToken),
    );

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async refreshTokens(refreshDto: RefreshTokenDto): Promise<RefreshResponse> {
    try {
      const payload = this.jwtService.verify<RefreshPayload>(
        refreshDto.refreshToken,
        {
          secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
        },
      );

      const user = await this.usersService.findById(payload.sub);
      if (!user?.refreshToken) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      const refreshTokenMatches = await bcrypt.compare(
        refreshDto.refreshToken,
        user.refreshToken,
      );

      if (!refreshTokenMatches) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      const tokens = await this.generateTokens(
        {
          sub: user._id.toString(),
          email: user.email,
          role: user.role,
        },
        refreshDto.rememberMe || false,
      );

      await this.usersService.updateRefreshToken(
        user._id.toString(),
        await this.hashToken(tokens.refreshToken),
      );

      return { accessToken: tokens.accessToken };
    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.updateRefreshToken(userId, null);
  }

  async validateUser(identifier: string, password: string): Promise<any> {
    const user = await this.usersService.findByIdentifier(identifier);
    if (!user?.isActive) {
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
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }

  private async generateTokens(payload: JwtPayload, rememberMe: boolean) {
    const accessTokenExpiration = rememberMe
      ? this.configService.get<string>("JWT_ACCESS_EXPIRATION_LONG")
      : this.configService.get<string>("JWT_ACCESS_EXPIRATION");

    const refreshTokenExpiration = rememberMe
      ? this.configService.get<string>("JWT_REFRESH_EXPIRATION_LONG")
      : this.configService.get<string>("JWT_REFRESH_EXPIRATION");

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>("JWT_ACCESS_SECRET"),
        expiresIn: accessTokenExpiration,
      }),
      this.jwtService.signAsync(
        { sub: payload.sub, email: payload.email },
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
