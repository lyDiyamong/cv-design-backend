import { Module } from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Section, sectionSchema } from 'src/schemas/section';
import { ResumeModule } from '../resume/resume.module';

@Module({
  controllers: [SectionController],
  providers: [SectionService],
  imports: [
    MongooseModule.forFeature([{ name: Section.name, schema: sectionSchema }]),
    ResumeModule,
  ],
  exports: [MongooseModule, SectionService],
})
export class SectionModule {}
