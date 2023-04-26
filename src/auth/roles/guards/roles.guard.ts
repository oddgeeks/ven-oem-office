import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { RoleAbilityFactory } from '../role-ability.factory';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private roleAbilityFactory: RoleAbilityFactory) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    return this.roleAbilityFactory.canActivate(context);
  }
}
