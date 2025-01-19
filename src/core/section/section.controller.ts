import {
  Body,
  Controller,
  Post,
  BadRequestException,
  HttpException,
  HttpStatus,
  Patch,
  HttpCode,
  Param,
  Get,
} from '@nestjs/common';
import { SectionService } from './section.service';
import { ResumeService } from '../resume/resume.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import {
  updateEachSectionSchema,
  updateSectionSchema,
  updateSectionSchemasTypes,
} from './dto/update-section.dto';

@Controller('section')
export class SectionController {
  constructor(
    private readonly sectionService: SectionService,
    private readonly resumeService: ResumeService,
  ) {}

  @Patch('edit/:resumeId')
  async createSection(
    @Body() body: any,
    @Param('resumeId') resumeId: string,
    @GetUser('userId') userId: string,
  ) {
    // Validate the base structure
    const parsedBody = updateSectionSchema.safeParse(body);

    if (!parsedBody.success) {
      throw new BadRequestException(parsedBody.error.errors);
    }

    const sections = parsedBody.data;

    // Each section has the same resume
    const resume = await this.resumeService.findOneResume(resumeId, userId);

    if (!resume) {
      throw new HttpException('Resume not found', HttpStatus.NOT_FOUND);
    }

    // Validate and process each section
    const results = await Promise.all(
      sections.map(async (section) => {
        const { type, content } = section;

        // Validate `content` dynamically based on `type`
        const contentSchema = updateSectionSchemasTypes[type];
        const contentValidation = contentSchema.safeParse(content);

        if (!contentValidation.success) {
          throw new BadRequestException(contentValidation.error.errors);
        }

        // Call the service to handle creation or updates for the section
        return this.sectionService.createOrUpdateSection(
          type,
          contentValidation.data,
          resumeId,
        );
      }),
    );

    return {
      message: 'Sections successfully processed',
      results,
    };
  }
  @Get('resume/:resumeId')
  @HttpCode(HttpStatus.OK)
  async getSectionByResumeId(@Param('resumeId') resumeId: string) {
    const result = await this.sectionService.getSectionByResumeId(resumeId);
    return { message: 'Sections found', data: result };
  }

  @Patch('edit/resume/:resumeId')
  @HttpCode(HttpStatus.ACCEPTED)
  async updateEachSection(
    @Param('resumeId') resumeId: string,
    @Body() body: any,
    @GetUser('userId') userId: string,
  ) {
    // Validate the base structure
    const parsedBody = updateEachSectionSchema.safeParse(body);
    if (!parsedBody.success) {
      throw new BadRequestException(parsedBody.error.errors);
    }

    const section = parsedBody.data;

    const { type, content } = section;

    const resume = await this.resumeService.findOneResume(resumeId, userId);

    if (!resume) {
      throw new HttpException('Resume not found', HttpStatus.NOT_FOUND);
    }

    const result = await this.sectionService.editSectionByType(
      resumeId,
      type,
      content,
    );
    return { message: 'Update Resume success', data: result };
  }
}
