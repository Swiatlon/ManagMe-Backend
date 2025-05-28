import { IsEnum, IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { Priority } from "../../../common/enums/priority.enum";
import { Status } from "../../../common/enums/status.enum";

export class CreateStoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(Priority)
  priority: Priority;

  @IsMongoId()
  projectId: string;

  @IsEnum(Status)
  status: Status = Status.Todo;

  @IsMongoId()
  ownerId: string;
}
