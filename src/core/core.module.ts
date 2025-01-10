import { Module } from '@nestjs/common';
import { ResumeModule } from './resume/resume.module';
import { SectionModule } from './section/section.module';

@Module({
  imports: [ResumeModule, SectionModule],
})
export class CoreModule {}
