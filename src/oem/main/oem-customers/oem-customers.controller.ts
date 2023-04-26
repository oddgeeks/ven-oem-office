import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  Crud,
  CrudAuth,
  CrudController,
  CrudRequest,
  ParsedRequest,
} from '@nestjsx/crud';
import { ApiBody } from '@nestjs/swagger';

import { OemCustomerEntity } from './oem-customer.entity';
import { OemCustomersService } from './oem-customers.service';
import { dto, serialize } from './oem-customer.dto';
import { OpportunityAccountGetDto } from '../../../shared/salesforce/salesforce.dto/opportunity-account.dto';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { SetCurrentUser } from '../oem-users/oem-users.decorators/set-current-user.decorator';

@Crud({
  model: {
    type: OemCustomerEntity,
  },
  params: {
    id: {
      field: 'customerId',
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
      quotes: {
        eager: false,
      },
      vendos: {
        eager: false,
      },
      customerProducts: {
        eager: false,
      },
      customerAddresses: {
        eager: false,
      },
      'customerAddresses.address': {
        eager: false,
        alias: 'address',
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
@ApiTags('Customer')
@Controller('customers')
export class OemCustomersController
  implements CrudController<OemCustomerEntity>
{
  constructor(public service: OemCustomersService) {}
  @Post(`salesforce/`)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        idOpportunity: { type: 'string' },
        idAccount: { type: 'string' },
      },
    },
  })
  async integrateCustomerSalesforce(
    @ParsedRequest() req: CrudRequest,
    @Body() params: OpportunityAccountGetDto,
  ) {
    return this.service.integrateCustomerSalesforce(req, params);
  }
}
