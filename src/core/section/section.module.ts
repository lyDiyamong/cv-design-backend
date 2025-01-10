import { Module } from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Section, sectionSchema } from 'src/schemas/section';

@Module({
  controllers: [SectionController],
  providers: [SectionService],
  imports: [
    MongooseModule.forFeature([{ name: Section.name, schema: sectionSchema }]),
  ],
  exports: [MongooseModule, SectionService],
})
export class SectionModule {}
