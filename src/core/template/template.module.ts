import { Module } from '@nestjs/common';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';
import { S3Module } from 'src/s3/s3.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Template, templateSchema } from 'src/schemas/template';

@Module({
  controllers: [TemplateController],
  providers: [TemplateService],
  imports: [
    MongooseModule.forFeature([
      { name: Template.name, schema: templateSchema },
    ]),
    S3Module,
  ],
  exports: [MongooseModule],
})
export class TemplateModule {}
