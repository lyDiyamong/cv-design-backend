// Nestjs
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResumeService } from './resume.service';
// Dto
import {
  CreateResumeDto,
  createResumeSchema,
  UpdateResumeDto,
  updateResumeSchema,
} from './dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { S3Service } from 'src/s3/s3.service';
// Pipe
import { ZodTransformPipe } from 'src/common/pipes/zod-transform.pipe';
import { ZodFileValidationPipe } from 'src/common/pipes/zod-file.pipe';

@Controller('resume')
export class ResumeController {
  constructor(
    private readonly resumeService: ResumeService,
    private readonly s3Service: S3Service,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('previewImg-file'))
  async create(
    @Body(new ZodTransformPipe(createResumeSchema))
    dto: CreateResumeDto,
    @UploadedFile(ZodFileValidationPipe)
    previewImgFile: Express.Multer.File,
    @GetUser('userId') userId: string,
  ) {
    const previewImg = await this.s3Service.uploadFile(
      previewImgFile,
      'resume-preview',
    );
    const result = await this.resumeService.createResume(
      dto,
      userId,
      previewImg,
    );
    return { message: 'Created Resume successfully', data: result };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser('userId') userId: string) {
    const result = await this.resumeService.findUserResume(userId);

    return { message: 'Found', data: result };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetUser('userId') userId: string) {
    const result = await this.resumeService.findOneResume(id, userId);
    return { message: 'Found', data: result };
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('previewImg-file'))
  async update(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
    @Body(new ZodTransformPipe(updateResumeSchema)) dto: UpdateResumeDto,
    @UploadedFile(ZodFileValidationPipe) previewImgFile: Express.Multer.File,
  ) {
    const resume = await this.resumeService.findOneResume(id, userId);

    if (resume && resume.previewImg) {
      await this.s3Service.deleteFile(resume.previewImg);
    }

    const previewImg = await this.s3Service.uploadFile(
      previewImgFile,
      'resume-preview',
    );
    const result = await this.resumeService.updateResume(
      id,
      userId,
      dto,
      previewImg,
    );
    return { message: 'Updated resume successfully', data: result };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async remove(@Param('id') id: string, @GetUser('userId') userId: string) {
    this.resumeService.deleteResume(id, userId);

    return { message: 'Deleted successfully' };
  }
}
