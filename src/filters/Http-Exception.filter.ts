import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { error } from 'console';

export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const { error, message } = exception.response;
    response.status(exception.getStatus()).json({
      status: exception.status,
      error: error,
      message: message,
    });
  }
}
