import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Resume } from 'src/schemas/resume';
import { Model } from 'mongoose';
import { CreateResumeDto, UpdateResumeDto } from './dto';

@Injectable()
export class ResumeService {
  constructor(
    @InjectModel(Resume.name) private readonly resumeModel: Model<Resume>,
  ) {}
  async createResume(dto: CreateResumeDto, userId: string, previewImg: string) {
    const { templateId, title } = dto;
    const createdResume = await this.resumeModel.create({
      userId,
      templateId,
      title,
      previewImg,
    });
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

  updateResume(id: string, userId: string, updateResumeDto: UpdateResumeDto) {
    return `This action updates a #${id} resume`;
  }

  remove(id: string) {
    return `This action removes a #${id} resume`;
  }
}
