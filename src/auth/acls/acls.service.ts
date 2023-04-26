/*
import { AccessControlService } from '@rockts-org/nestjs-access-control';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { User } from '../../oem/oem-users/oem-user.entity';

export class ACService implements AccessControlService {
  async getUser<T>(context: ExecutionContext): Promise<T> {
    const request = context.switchToHttp().getRequest();
    return request.user as T;
  }
  async getUserRoles(context: ExecutionContext): Promise<string | string[]> {
    const user = await this.getUser<User>(context);
    if (!user || !user.role) throw new UnauthorizedException();
    return user.role.roleName;
  }
}*/
