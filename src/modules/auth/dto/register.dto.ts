import { IsString, MinLength, IsNotEmpty, IsEnum } from "class-validator";
import { Role } from "../../../common/enums/role.enum";

export class RegisterDto {
  @IsNotEmpty()
  identifier: string;

  @IsString()
  @MinLength(2)
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
