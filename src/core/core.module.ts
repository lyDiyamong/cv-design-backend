import { Module } from '@nestjs/common';
import { ResumeModule } from './resume/resume.module';
import { SectionModule } from './section/section.module';
import { TemplateModule } from './template/template.module';

@Module({
  imports: [ResumeModule, SectionModule, TemplateModule],
})
export class CoreModule {}
