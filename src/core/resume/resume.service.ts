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
    const { title, previewImg } = dto;
    const createdResume = await this.resumeModel.create({
      userId,
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

    const defaultSections = sectionTypes.map((type) => {
      let content = {}; // Default to an empty object

      switch (type) {
        case 'personal':
          content = { firstName: '', lastName: '' };
          break;
        case 'contact':
          content = { phoneNumber: '', email: '', address: '' };
          break;
        case 'skills':
          content = [{ name: '', level: '' }]; // Skills content should likely be an array
          break;
        case 'experiences':
          content = [
            { jobTitle: '', position: '', startDate: '', endDate: '' },
          ];
          break;
        case 'educations':
          content = [
            { schoolName: '', degreeMajor: '', startDate: '', endDate: '' },
          ];
          break;
        case 'languages':
          content = [{ language: '', level: '' }];
          break;
        case 'references':
          content = [
            {
              firstName: '',
              lastName: '',
              position: '',
              company: '',
              email: '',
              phoneNumber: '',
            },
          ];
          break;
        default:
          content = {}; // Default to empty object for unknown section types
      }

      return {
        type,
        resumeId: createdResume._id,
        content,
      };
    });

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
