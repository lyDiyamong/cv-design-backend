// src/filters/mongo-exception.filter.ts

import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { Request, Response } from 'express';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception.code === 11000) {
      // Duplicate key error (E11000)
      response.status(400).json({
        statusCode: 400,
        message: `Duplicate key error: ${exception.message}`,
        error: 'Bad Request',
        path: request.url,
      });
    } else {
      // For other MongoDB errors
      response.status(500).json({
        statusCode: 500,
        message: 'Database error occurred',
        error: 'Internal Server Error',
        path: request.url,
      });
    }
  }
}
