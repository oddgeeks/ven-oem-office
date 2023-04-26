import { RoleAbility } from './role-ability.type';

interface IRoleHandler {
  handle(ability: RoleAbility): boolean;
}

type RoleHandlerCallback = (ability: RoleAbility) => boolean;

export type RoleHandler = IRoleHandler | RoleHandlerCallback;
