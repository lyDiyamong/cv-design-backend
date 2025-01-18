import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Resume } from 'src/schemas/resume';
import { Model } from 'mongoose';
import { CreateResumeDto, UpdateResumeDto } from './dto';
import { Section } from 'src/schemas/section';

@Injectable()
export class ResumeService {
  constructor(
    @InjectModel(Resume.name) private readonly resumeModel: Model<Resume>,
    @InjectModel(Section.name)
    private readonly sectionModel: Model<Section>,
  ) {}
  async createResume(dto: CreateResumeDto, userId: string) {
    const { templateId, title, previewImg } = dto;
    const createdResume = await this.resumeModel.create({
      userId,
      templateId,
      title,
      previewImg,
    });

    // Create default sections for the resume
    const sectionTypes = [
      'personal',
      'contact',
      'skills',
      'experiences',
      'educations',
      'languages',
      'references',
    ];

    const defaultSections = sectionTypes.map((type) => ({
      type,
      resumeId: createdResume._id,
      content: {},
    }));

    await this.sectionModel.insertMany(defaultSections);

    return createdResume;
  }

  async findUserResume(userId: string) {
    const userResumes = await this.resumeModel.find({ userId });
    return userResumes;
  }

  async findOneResume(id: string, userId: string) {
    const userResume = await this.resumeModel.findOne({ userId, _id: id });

    if (!userResume) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    return userResume;
  }

  async updateResume(
    id: string,
    userId: string,
    dto: UpdateResumeDto,
    previewImg: string,
  ) {
    const updatedResume = await this.resumeModel.findOneAndUpdate(
      { userId, _id: id },
      {
        $set: {
          userId,
          templateId: dto.templateId,
          title: dto.title,
          previewImg,
        },
      },
      { new: true },
    );

    return updatedResume;
  }

  async deleteResume(id: string, userId: string) {
    const deletedResume = await this.resumeModel.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deletedResume)
      throw new HttpException('Resume not found', HttpStatus.NOT_FOUND);
  }
}
