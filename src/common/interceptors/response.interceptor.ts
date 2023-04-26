import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import * as pluralize from 'pluralize';
import { Response } from '../serializers/response.interface';

function toFirstUpperCase(word): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function generateMessage({ path, method }): string {
  const pathParts = path.split('/');
  const model = toFirstUpperCase(pathParts[pathParts.length - 1]);
  let message = `${model} `;
  if (model === ':id') {
    message = `${toFirstUpperCase(pluralize.singular(pathParts[1]))} `;
  }
  switch (method) {
    case 'GET':
      message += 'Retrieved';
      break;
    case 'POST':
      message += 'Created';
      break;
    case 'PUT':
      message += 'Replaced';
      break;
    case 'PATCH':
      message += 'Updated';
      break;
    case 'DELETE':
      message += 'Deleted';
      break;
  }
  return message;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const { count, total, page, pageCount } = data || {
          count: 0,
          total: 0,
          page: 0,
          pageCount: 0,
        };
        const metaPagination = { count, total, page, pageCount };
        return {
          status: context.getArgByIndex(1)?.statusCode,
          message: generateMessage({
            path: context.getArgByIndex(1)?.req?.route?.path,
            method: context.getArgByIndex(1)?.req?.method,
          }),
          success: true,
          data: data?.data ?? data,
          ...metaPagination,
        };
      }),
    );
  }
}
