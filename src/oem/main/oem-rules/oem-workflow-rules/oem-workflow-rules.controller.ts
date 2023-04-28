import { ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth, CrudController, Feature } from '@nestjsx/crud';
import { OemWorkflowRule } from './oem-workflow-rule.entity';
import { OemWorkflowRulesService } from './oem-workflow-rules.service';
import { dto, serialize } from './oem-workflow-rule.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JWTAuthGuard } from '../../../../auth/guards/jwt-auth.guard';
import { SessionAuthGuard } from '../../../../auth/guards/session-auth.guard';
import { SetCurrentUser } from '../../oem-users/oem-users.decorators/set-current-user.decorator';
import { CloneCrudController } from '../../../../common/controllers/clone-crud.controller';
import { SetController } from '../../../../common/decorators/set-controller.decorator';
import { DeleteCrudController } from '../../../../common/controllers/delete-crud.controller';

@Crud({
  model: {
    type: OemWorkflowRule,
  },
  params: {
    id: {
      field: 'workflowRuleId',
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
      ownerUser: {
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
@ApiTags('Workflow Approval')
@Controller('workflow-rules')
@Feature('Workflow-Rules')
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
export class OemWorkflowRulesController
  implements CrudController<OemWorkflowRule>
{
  constructor(public service: OemWorkflowRulesService) {}
}
