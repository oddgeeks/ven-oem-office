import { SetMetadata } from '@nestjs/common';

import { CHECK_ROLES_KEY } from '../constants';
import { RoleHandler } from '../types/role-handler.type';

export const CheckRoles = (...handlers: RoleHandler[]) =>
  SetMetadata(CHECK_ROLES_KEY, handlers);
