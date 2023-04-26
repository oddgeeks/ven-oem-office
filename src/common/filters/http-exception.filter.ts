import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Exception } from '../serializers/exception.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const exeption = this.prepareException(exception);

    response.status(exeption.status).send(exeption);
  }

  prepareException(exc: any): Exception<HttpException> {
    if (process.env.NODE_ENV !== 'test') {
      console.log(exc);
    }
    const error =
      exc instanceof HttpException
        ? exc
        : new InternalServerErrorException(exc.message);
    const status = error.getStatus();
    const response = error.getResponse() as { message: string };
    return {
      status: status,
      message: typeof response === 'object' ? response.message : response,
      success: false,
      error: exc.message,
    } as unknown as Exception<HttpException>;
  }
}
