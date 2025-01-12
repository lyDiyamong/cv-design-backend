import { Module } from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Section, sectionSchema } from 'src/schemas/section';
import { ResumeModule } from '../resume/resume.module';
import { S3Module } from 'src/s3/s3.module';

@Module({
  controllers: [SectionController],
  providers: [SectionService],
  imports: [
    MongooseModule.forFeature([{ name: Section.name, schema: sectionSchema }]),
    ResumeModule,
    S3Module,
  ],
  exports: [MongooseModule, SectionService],
})
export class SectionModule {}
