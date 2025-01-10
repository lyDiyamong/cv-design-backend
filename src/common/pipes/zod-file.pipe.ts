import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { fileSchema } from '../../utils/zod-file.schema';

@Injectable()
export class ZodFileValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required');
    const parseResult = fileSchema.safeParse(file);

    if (!parseResult.success) {
      const errorMessages = parseResult.error.errors;
      throw new BadRequestException(errorMessages);
    }

    return file;
  }
}
