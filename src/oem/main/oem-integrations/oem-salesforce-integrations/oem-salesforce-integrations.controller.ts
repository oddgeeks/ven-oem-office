import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';
import { dto, serialize } from './oem-salesforce-integration.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { SessionAuthGuard } from '../../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../../auth/guards/jwt-auth.guard';
import { SetCurrentUser } from '../../oem-users/oem-users.decorators/set-current-user.decorator';
import { OemSalesforceIntegrationEntity } from './oem-salesforce-integration.entity';
import { OemSalesforceIntegrationsService } from './oem-salesforce-integrations.service';

@Crud({
  model: {
    type: OemSalesforceIntegrationEntity,
  },
  params: {
    id: {
      field: 'salesforceIntegrationId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
    join: {
      hierarchies: {
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
@ApiTags('Integrations')
@Controller('salesforce-integrations')
export class OemSalesforceIntegrationsController
  implements CrudController<OemSalesforceIntegrationEntity>
{
  constructor(public service: OemSalesforceIntegrationsService) {}
}
