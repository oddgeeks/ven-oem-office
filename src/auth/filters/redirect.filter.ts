import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  UnauthorizedException,
} from '@nestjs/common';
import { APP_ROOT_URL } from '../../environments';

@Catch()
export class RedirectFilter<T> implements ExceptionFilter {
  catch(exception: UnauthorizedException | any, host: ArgumentsHost): any {
    console.error('AuthRedirect', exception);
    //TODO: need to use config here
    host
      .switchToHttp()
      .getResponse()
      .redirect(
        `${APP_ROOT_URL}/login?login_error_code=${
          (exception.getStatus && exception.getStatus()) || 404
        }`,
      );
  }
}
