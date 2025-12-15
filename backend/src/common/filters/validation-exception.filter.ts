import { ExceptionFilter, Catch, ArgumentsHost, HttpException, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();

    let message = 'Validation failed';
    let details = {};

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const responseObj = exceptionResponse as any;
      
      if (responseObj.message) {
        if (Array.isArray(responseObj.message)) {
          message = 'Validation failed';
          details = { 
            errors: responseObj.message,
            fields: responseObj.message.map((msg: string) => {
              // Extract field name from validation message
              const match = msg.match(/^(\w+)/);
              return match ? match[1] : 'unknown';
            })
          };
        } else {
          message = responseObj.message;
        }
      }
    }

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        message,
        details,
      });
  }
}