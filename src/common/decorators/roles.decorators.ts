import { SetMetadata } from "@nestjs/common";
import { Role } from "../enums/role.enum";

// Guards
export const Roles = (...roles: Role[]) => SetMetadata("roles", roles);
