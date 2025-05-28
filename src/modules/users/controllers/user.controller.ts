import { Role } from "@/common/enums/role.enum";
import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from "@nestjs/common";
import { CreateUserDto } from "../dto/create-user.dto";
import { UsersService } from "../services/user.service";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  findAll() {
    return this.usersService.findAll();
  }

  @Get("by-role/:role")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  findByRole(@Param("role") role: Role) {
    return this.usersService.findByRole(role);
  }

  @Get(":id")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
