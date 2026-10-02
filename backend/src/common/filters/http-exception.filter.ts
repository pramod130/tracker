import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred';
    let errorCode = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        message = (res as any).message || exception.message;
        errorCode = (res as any).error || (res as any).errorCode || errorCode;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // Clean user-friendly message, avoid leaking raw internal stack trace
    response.status(status).json({
      success: false,
      message: Array.isArray(message) ? message.join(', ') : message,
      errorCode,
    });
  }
}
