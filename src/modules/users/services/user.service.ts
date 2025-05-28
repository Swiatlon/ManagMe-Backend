import { Role } from "@/common/enums/role.enum";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "../dto/create-user.dto";
import { UserRepository } from "../repositories/user.repository";
import { UserDocument } from "../schemas/user.schema";

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    return this.userRepository.create(createUserDto);
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userRepository.findAll();
  }

  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    const user = await this.userRepository.update(id, updateUserDto);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.userRepository.remove(id);
    if (!deleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async findByRole(role: Role): Promise<UserDocument[]> {
    return this.userRepository.findByRole(role);
  }

  // Auth-specific methods
  async findByIdentifier(identifier: string): Promise<UserDocument | null> {
    return this.userRepository.findByIdentifier(identifier);
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userRepository.findById(id);
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
    return this.userRepository.updateRefreshToken(userId, refreshToken);
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return this.userRepository.validatePassword(plainPassword, hashedPassword);
  }
}
