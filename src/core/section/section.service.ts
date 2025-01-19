import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Section, sectionSchema } from '../../schemas/section';
import mongoose from 'mongoose';
import { UpdateEachSectionType } from './dto/update-section.dto';

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

    // Create a new section
    const newSection = new this.sectionModel({
      type,
      resumeId: objectIdResumeId,
      content,
    });

    return newSection.save();
  }

  async editSectionByType(
    resumeId: string,
    type: UpdateEachSectionType['type'],
    content: UpdateEachSectionType['content'],
  ) {
    const objectIdResumeId = new mongoose.Types.ObjectId(resumeId);
    // Check if the section already exists
    const existingSection = await this.sectionModel.exists({
      type,
      resumeId: objectIdResumeId,
    });

    if (!existingSection)
      throw new HttpException(
        'Section with this resumeId and type not exist',
        HttpStatus.NOT_FOUND,
      );

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
}
