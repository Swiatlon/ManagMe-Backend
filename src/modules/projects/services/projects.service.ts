import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProjectDto } from "../dto/create-project.dto";
import { UpdateProjectDto } from "../dto/update-project.dto";
import { ProjectRepository } from "../repositories/projects.repository";
import { Project } from "../schemas/projects.schema";

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectRepository.create(createProjectDto);
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepository.findAll();
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.projectRepository.update(id, updateProjectDto);
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.projectRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
  }

  async findByName(name: string): Promise<Project[]> {
    return this.projectRepository.findByName(name);
  }
}
