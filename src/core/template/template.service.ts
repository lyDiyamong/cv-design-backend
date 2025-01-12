import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Template } from 'src/schemas/template';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Injectable()
export class TemplateService {
  constructor(
    @InjectModel(Template.name) private readonly templateModel: Model<Template>,
  ) {}
  async createTemplate(dto: CreateTemplateDto) {
    const template = await this.templateModel.create({
      name: dto.name,
      description: dto.description,
      tempImg: dto.tempImg,
    });

    return template;
  }

  async getAllTemplates() {
    const templates = await this.templateModel.find();

    return templates;
  }

  async getOneTemplate(id: string) {
    const template = await this.templateModel.findById(id);

    if (!template)
      throw new HttpException('Template not found', HttpStatus.NOT_FOUND);
  }

  async updateTemplate(id: string, dto: UpdateTemplateDto) {
    const updatedTemplate = await this.templateModel.findByIdAndUpdate(
      id,
      {
        name: dto.name,
        description: dto.description,
        tempImg: dto.tempImg,
      },
      {
        new: true,
        upsert: true,
      },
    );

    if (!updatedTemplate) throw new BadRequestException('Update failed');

    return updatedTemplate;
  }

  async deleteTemplate(id: string) {
    const deleteTemplate = await this.templateModel.findByIdAndDelete(id);

    if (!deleteTemplate) throw new BadRequestException('Delete failed');

    return { message: 'Delete successfully' };
  }
}
