import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Section } from 'src/schemas/section';

@Injectable()
export class SectionService {
  constructor(
    @InjectModel(Section.name) private sectionModel: Model<Section>,
  ) {}

  async createSection(type: string, content: any, resumeId: string) {
    const section = new this.sectionModel({ type, content, resumeId });
    return section.save();
  }
}
