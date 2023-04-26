import { Module } from '@nestjs/common';

import { RoleAbilityFactory } from './role-ability.factory';
import { RolesGuard } from './guards/roles.guard';

@Module({
  providers: [RoleAbilityFactory, RolesGuard],
  exports: [RoleAbilityFactory],
})
export class ACLModule {}
