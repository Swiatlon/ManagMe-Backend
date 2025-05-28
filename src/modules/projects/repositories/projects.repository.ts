import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseRepository } from "../../../common/interfaces/base-repository.interface";
import { Project, ProjectDocument } from "../schemas/projects.schema";

@Injectable()
export class ProjectRepository implements BaseRepository<Project> {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async create(project: Partial<Project>): Promise<Project> {
    const createdProject = new this.projectModel(project);
    return createdProject.save();
  }

  async findAll(): Promise<Project[]> {
    return this.projectModel.find().exec();
  }

  async findById(id: string): Promise<Project | null> {
    return this.projectModel.findById(id).exec();
  }

  async update(id: string, project: Partial<Project>): Promise<Project | null> {
    return this.projectModel
      .findByIdAndUpdate(id, project, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.projectModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async findByName(name: string): Promise<Project[]> {
    return this.projectModel.find({ name: new RegExp(name, "i") }).exec();
  }
}
