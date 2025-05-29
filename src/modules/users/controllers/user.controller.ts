import { Controller, Get, Param, Query } from "@nestjs/common";
import { UserDocument } from "../schemas/user.schema";
import { Role } from "@/common/enums/role.enum";
import { UsersService } from "../services/user.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query("role") role?: Role): Promise<UserDocument[]> {
    if (role) {
      return this.usersService.findByRole(role);
    }
    return this.usersService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<UserDocument> {
    return this.usersService.findOne(id);
  }
}
