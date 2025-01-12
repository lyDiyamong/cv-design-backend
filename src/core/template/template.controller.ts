import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { TemplateService } from './template.service';
import { ZodTransformPipe } from 'src/common/pipes/zod-transform.pipe';
import {
  CreateTemplateDto,
  createTemplateSchema,
} from './dto/create-template.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}
  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ZodTransformPipe(createTemplateSchema)) dto: CreateTemplateDto,
  ) {
    const result = await this.templateService.createTemplate(dto);

    return result;
  }
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('id') id: string) {
    const result = await this.templateService.getOneTemplate(id);

    return { message: 'Found', data: result };
  }
}
