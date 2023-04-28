import { ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth, CrudController, Feature } from '@nestjsx/crud';
import { ApiBearerAuth } from '@nestjs/swagger';

import { OemVacationRule } from './oem-vacation-rule.entity';
import { OemVacationRulesService } from './oem-vacation-rules.service';
import { dto, serialize } from './oem-vacation-rule.dto';
import { SessionAuthGuard } from '../../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../../auth/guards/jwt-auth.guard';
import { SetCurrentUser } from '../../oem-users/oem-users.decorators/set-current-user.decorator';
import { CloneCrudController } from '../../../../common/controllers/clone-crud.controller';
import { SetController } from '../../../../common/decorators/set-controller.decorator';
import { DeleteCrudController } from '../../../../common/controllers/delete-crud.controller';

@ApiBearerAuth('JWT-auth')
@Crud({
  model: {
    type: OemVacationRule,
  },
  params: {
    id: {
      field: 'vacationRuleId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
    join: {
      company: {
        eager: false,
      },
      sourceUser: {
        eager: false,
      },
      targetUser: {
        eager: false,
      },
    },
  },
  routes: {
    only: [
      'createOneBase',
      'getOneBase',
      'getManyBase',
      'updateOneBase',
      'deleteOneBase',
    ],
  },
  dto,
  serialize,
})
@ApiTags('Workflow Approval')
@Controller('vacation-rules')
@Feature('Vacation-Rules')
@ApiBearerAuth('JWT-auth')
@UseGuards(SessionAuthGuard, JWTAuthGuard)
@CrudAuth({
  filter: (req) => ({
    companyId: req.user.companyId,
    isEnabled: true,
  }),
  persist: (req) => ({
    companyId: req.user.companyId,
    isEnabled: true,
  }),
})
@SetCurrentUser
@SetController([CloneCrudController, DeleteCrudController])
export class OemVacationRulesController
  implements CrudController<OemVacationRule>
{
  constructor(public service: OemVacationRulesService) {}
}
