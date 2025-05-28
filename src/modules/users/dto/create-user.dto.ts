import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  IsEnum,
} from "class-validator";
import { Role } from "../../../common/enums/role.enum";

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
