import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { TaskPriority } from "../../../common/enums/task-priority.enum";
import { TaskStatus } from "../../../common/enums/task-status.enum";

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: String, enum: TaskPriority, required: true })
  priority: TaskPriority;

  @Prop({ type: Types.ObjectId, ref: "Story", required: true })
  story: Types.ObjectId;

  @Prop({ required: true })
  estimatedHours: number;

  @Prop({ type: String, enum: TaskStatus, default: TaskStatus.Todo })
  status: TaskStatus;

  @Prop({ type: String })
  startDate?: string;

  @Prop({ type: String })
  endDate?: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  assignedUser?: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    ret.createdAt = ret.createdAt?.toISOString();
    ret.updatedAt = ret.updatedAt?.toISOString();
    return ret;
  },
});
