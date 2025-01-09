import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodTransformPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema<any>) {}

  transform(value: any) {
    const parsedValue = this.schema.safeParse(value);
    // Validate and transform the input using the schema
    console.log('Date value', parsedValue);
    if (parsedValue.success) return parsedValue.data;
    // Format Zod errors into a NestJS-compatible error response
    throw new BadRequestException(parsedValue.error.format());
  }
}
