import { Role } from "@/common/enums/role.enum";
import { Injectable, ConflictException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  IUserRepository,
  CreateUserData,
  UpdateUserData,
} from "../interfaces/user.interfaces";
import { User, UserDocument } from "../schemas/user.schema";

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userData: CreateUserData): Promise<UserDocument> {
    const existingUser = await this.findByIdentifier(userData.email);
    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const user = new this.userModel({
      ...userData,
      password: hashedPassword,
    });

    return user.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByIdentifier(identifier: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        $or: [{ email: identifier }],
      })
      .exec();
  }

  async findByRole(role: Role): Promise<UserDocument[]> {
    return this.userModel.find({ role }).exec();
  }

  async update(
    id: string,
    updateData: UpdateUserData,
  ): Promise<UserDocument | null> {
    // If password is being updated, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }

    // Check for email conflicts if email is being updated
    if (updateData.email) {
      const existingUser = await this.findByEmail(updateData.email);
      if (existingUser && existingUser._id.toString() !== id) {
        throw new ConflictException("User with this email already exists");
      }
    }

    return this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken });
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
