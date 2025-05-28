import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Priority } from "../../../common/enums/priority.enum";
import { Status } from "../../../common/enums/status.enum";

export type StoryDocument = Story & Document;

@Schema({ timestamps: true })
export class Story {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: String, enum: Priority, required: true })
  priority: Priority;

  @Prop({ type: Types.ObjectId, ref: "Project", required: true })
  projectId: Types.ObjectId;

  @Prop({ type: String, enum: Status, default: Status.Todo })
  status: Status;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  ownerId: Types.ObjectId;
}

export const StorySchema = SchemaFactory.createForClass(Story);

StorySchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    ret.createdAt = ret.createdAt?.toISOString();
    return ret;
  },
});
