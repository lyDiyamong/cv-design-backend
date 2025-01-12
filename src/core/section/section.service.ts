import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Section } from '../../schemas/section';

@Injectable()
export class SectionService {
  constructor(
    @InjectModel(Section.name)
    private readonly sectionModel: Model<Section>,
  ) {}

  async createOrUpdateSection(
    type: string,
    content: any,
    resumeId: string,
  ): Promise<Section> {
    // Check if the section already exists
    const existingSection = await this.sectionModel.exists({
      type,
      resumeId,
    });

    if (existingSection) {
      // Update the existing section
      const updatedContent = await this.sectionModel.findOneAndUpdate(
        { type, resumeId },
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
      resumeId,
      content,
    });

    return newSection.save();
  }
}
