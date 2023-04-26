import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OpenidAuthGuard extends AuthGuard('oidc') {
 /* async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    /!* console.log('sessionSAVE', result, request);*!/
    await super.logIn(request);
    return result;
  }*/
}
