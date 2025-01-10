import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionSchemas, CreateSectionSchema } from './dto/create-section.dto';

@Controller('section')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Post()
  async createSection(@Body() body: any) {
    // Validate base structure
    const parsedBody = CreateSectionSchema.safeParse(body);

    if (!parsedBody.success) {
      throw new BadRequestException(parsedBody.error.errors);
    }

    const { type, content, resumeId } = parsedBody.data;

    // Validate `content` dynamically based on `type`
    const contentSchema = SectionSchemas[type];
    const contentValidation = contentSchema.safeParse(content);

    if (!contentValidation.success) {
      throw new BadRequestException(contentValidation.error.errors);
    }

    // If validation passes, call the service
    return this.sectionService.createSection(
      type,
      contentValidation.data,
      resumeId,
    );
  }
}
