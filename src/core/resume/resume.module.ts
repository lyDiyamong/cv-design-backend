import { Module, forwardRef } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { ResumeController } from './resume.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Resume, resumeSchema } from 'src/schemas/resume';
import { S3Module } from 'src/s3/s3.module';
import { SectionModule } from '../section/section.module';

@Module({
  controllers: [ResumeController],
  providers: [ResumeService],
  imports: [
    MongooseModule.forFeature([{ name: Resume.name, schema: resumeSchema }]),
    S3Module,
    forwardRef(() => SectionModule), // Use forwardRef for SectionModule
  ],
  exports: [MongooseModule, ResumeService],
})
export class ResumeModule {}
