import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Param, Patch, UseGuards, UseInterceptors } from '@nestjs/common';
import { Crud, CrudAuth, CrudController, CrudRequest, CrudRequestInterceptor, ParsedRequest } from '@nestjsx/crud';
import { OemShadingRule } from './oem-shading-rule.entity';
import { OemShadingRulesService } from './oem-shading-rules.service';
import { dto, serialize } from './oem-shading-rule.dto';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { SessionAuthGuard } from '../../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../../auth/guards/jwt-auth.guard';
import { SetCurrentUser } from '../../oem-users/oem-users.decorators/set-current-user.decorator';
import { CloneCrudController } from '../../../../common/controllers/clone-crud.controller';
import { SetController } from '../../../../common/decorators/set-controller.decorator';
import { DeleteCrudController } from '../../../../common/controllers/delete-crud.controller';
import {
  OemShadingRulePriorityDto,
} from './oem-shading-rule.dto/oem-shading-rule.priority.dto';

@Crud({
  model: {
    type: OemShadingRule,
  },
  params: {
    id: {
      field: 'shadingRuleId',
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
@ApiTags('Shading Rules')
@Controller('shading-rules')
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
export class OemShadingRulesController implements CrudController<OemShadingRule> {
  constructor(public service: OemShadingRulesService) {

  }

  @ApiOkResponse({
    description: 'The priority swap',
  })
  @ApiOperation({
    summary:
      'Exchange priority between rules. If rule with a such priority was not found - will just replace the current one',
  })
  @Patch(`/:id/priority`)
  @ApiParam({
    name: 'id',
    description: 'Shading-Rule Id',
    allowEmptyValue: false,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        priority: { type: 'number' },
      },
    },
  })
  @UseInterceptors(CrudRequestInterceptor)
  async replacePriority(@ParsedRequest() req: CrudRequest, @Body() dto: OemShadingRulePriorityDto) {
    return await this.service.replacePriority(req, dto);
  }
}
