import { Module } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { ResumeController } from './resume.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Resume, resumeSchema } from 'src/schemas/resume';
import { S3Module } from 'src/s3/s3.module';

@Module({
  controllers: [ResumeController],
  providers: [ResumeService],
  imports: [
    MongooseModule.forFeature([{ name: Resume.name, schema: resumeSchema }]),
    S3Module,
  ],
  exports: [MongooseModule, ResumeService],
})
export class ResumeModule {}
