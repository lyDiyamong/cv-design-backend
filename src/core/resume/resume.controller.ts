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
import { ResumeService } from './resume.service';
import { CreateResumeDto, createResumeSchema, UpdateResumeDto } from './dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { S3Service } from 'src/s3/s3.service';
import { ZodTransformPipe } from 'src/common/pipes/zod-transform.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
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
    createResumeDto: CreateResumeDto,
    @UploadedFile(ZodFileValidationPipe)
    previewImgFile: Express.Multer.File,
    @GetUser('userId') userId: string,
  ) {
    const previewImg = await this.s3Service.uploadFile(
      previewImgFile,
      'resume-preview/',
    );
    const resume = await this.resumeService.createResume(
      createResumeDto,
      userId,
      previewImg,
    );
    return;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@GetUser('userId') userId: string) {
    return this.resumeService.findUserResume(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('userId') userId: string) {
    return this.resumeService.findOneResume(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
    @Body() updateResumeDto: UpdateResumeDto,
  ) {
    return this.resumeService.updateResume(id, userId, updateResumeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resumeService.remove(id);
  }
}
