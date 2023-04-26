import { Ability } from '@casl/ability';

import { RoleActions } from './role-actions.enum';
import { RoleSubjects } from './role-subjects.type';

export type RoleAbility = Ability<[RoleActions, RoleSubjects]>;
