import { UserDocument } from "../schemas/user.schema";
import { Role } from "../../../common/enums/role.enum";

export interface CreateUserData {
  identifier: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface UpdateUserData {
  identifier?: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
  refreshToken?: string;
}

export interface IUserRepository {
  create(userData: CreateUserData): Promise<UserDocument>;
  findAll(): Promise<UserDocument[]>;
  findById(id: string): Promise<UserDocument | null>;
  findByIdentifier(identifier: string): Promise<UserDocument | null>;
  findByRole(role: Role): Promise<UserDocument[]>;
  remove(id: string): Promise<boolean>;
  updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void>;
}
