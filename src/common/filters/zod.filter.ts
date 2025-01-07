import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ZodValidationException } from 'nestjs-zod';

@Catch(ZodValidationException)
export class ZodExceptionFilter implements ExceptionFilter {
  catch(exception: ZodValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Customize error response
    response.status(400).json({
      statusCode: 400,
      message: 'Validation failed',
      errors: exception
        .getZodError()
        .errors.map((err) => err.path[0] + ': ' + err.message),
    });
  }
}
