import { Role } from "../../../common/enums/role.enum";

export interface JwtPayload {
  sub: string;
  identifier: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export interface RefreshPayload {
  sub: string;
  identifier: string;
  iat?: number;
  exp?: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    identifier: string;
    firstName: string;
    lastName: string;
    role: Role;
  };
}

export interface RefreshResponse {
  accessToken: string;
}
