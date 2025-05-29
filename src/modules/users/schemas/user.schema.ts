import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Role } from "../../../common/enums/role.enum";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ type: String, enum: Role, required: true })
  role: Role;

  // New fields for authentication
  @Prop({ required: true, unique: true })
  identifier: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.id = ret._id as string;
    delete ret._id;
    delete ret.__v;
    delete ret.password; // Never expose password in JSON
    delete ret.refreshToken; // Never expose refresh token in JSON
    return ret;
  },
});
