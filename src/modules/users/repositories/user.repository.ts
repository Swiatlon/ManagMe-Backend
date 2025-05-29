import { Role } from "@/common/enums/role.enum";
import { Injectable, ConflictException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IUserRepository, CreateUserData } from "../interfaces/user.interfaces";
import { User, UserDocument } from "../schemas/user.schema";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userData: CreateUserData): Promise<UserDocument> {
    const existingUser = await this.findByIdentifier(userData.identifier);

    if (existingUser) {
      throw new ConflictException("User with this identifier already exists");
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

  async findByIdentifier(identifier: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        $or: [{ identifier: identifier }],
      })
      .exec();
  }

  async findByRole(role: Role): Promise<UserDocument[]> {
    return this.userModel.find({ role }).exec();
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
