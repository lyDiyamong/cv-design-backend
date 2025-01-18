import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Section } from '../../schemas/section';
import mongoose from 'mongoose';

@Injectable()
export class SectionService {
  constructor(
    @InjectModel(Section.name)
    private readonly sectionModel: Model<Section>,
  ) {}

  async getSectionByResumeId(resumeId: string) {
    // Convert to ObjectId
    const objectIdResumeId = new mongoose.Types.ObjectId(resumeId);
    const sections = await this.sectionModel.find({
      resumeId: objectIdResumeId,
    });
    if (!sections || sections.length === 0) {
      throw new HttpException(
        'No section with this resume found',
        HttpStatus.NOT_FOUND,
      );
    }

    console.log('section', sections);

    return sections;
  }

  async createOrUpdateSection(
    type: string,
    content: any,
    resumeId: string,
  ): Promise<Section> {
    const objectIdResumeId = new mongoose.Types.ObjectId(resumeId);
    // Check if the section already exists
    const existingSection = await this.sectionModel.exists({
      type,
      resumeId: objectIdResumeId,
    });

    if (existingSection) {
      // Update the existing section
      const updatedContent = await this.sectionModel.findOneAndUpdate(
        { type, resumeId: objectIdResumeId },
        { $set: { content } },
        {
          new: true,
        },
      );
      return updatedContent;
    }

    console.log('Section contetn', existingSection);

    // Create a new section
    const newSection = new this.sectionModel({
      type,
      resumeId: objectIdResumeId,
      content,
    });

    return newSection.save();
  }
}
