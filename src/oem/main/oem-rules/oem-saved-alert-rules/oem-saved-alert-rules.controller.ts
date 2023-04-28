import { ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth, CrudController, Feature } from '@nestjsx/crud';
import { OemSavedAlertRule } from './oem-saved-alert-rule.entity';
import { OemSavedAlertRulesService } from './oem-saved-alert-rules.service';
import { dto, serialize } from './oem-saved-alert-rule.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SetCurrentUser } from '../../oem-users/oem-users.decorators/set-current-user.decorator';
import { JWTAuthGuard } from '../../../../auth/guards/jwt-auth.guard';
import { SessionAuthGuard } from '../../../../auth/guards/session-auth.guard';
import { CloneCrudController } from '../../../../common/controllers/clone-crud.controller';
import { SetController } from '../../../../common/decorators/set-controller.decorator';
import { DeleteCrudController } from '../../../../common/controllers/delete-crud.controller';

@ApiBearerAuth('JWT-auth')
@Crud({
  model: {
    type: OemSavedAlertRule,
  },
  params: {
    id: {
      field: 'savedAlertRuleId',
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
      user: {
        eager: false,
      },
    },
  },
  routes: {
    exclude: ['createManyBase'],
  },
  dto,
  serialize,
})
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
@ApiTags('Users')
@Controller('saved-alert-rules')
@Feature('saved-alert-rules')
@SetCurrentUser
@SetController([CloneCrudController, DeleteCrudController])
export class OemSavedAlertRulesController
  implements CrudController<OemSavedAlertRule>
{
  constructor(public service: OemSavedAlertRulesService) {}
}
