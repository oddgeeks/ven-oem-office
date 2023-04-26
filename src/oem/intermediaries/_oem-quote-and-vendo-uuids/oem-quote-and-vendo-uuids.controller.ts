import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';

import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { QuoteAndVendoUuid } from './oem-quote-and-vendo-uuid.entity';
import { OemQuoteAndVendoUuidsService } from './oem-quote-and-vendo-uuids.service';
import { dto, serialize } from './oem-quote-and-vendo-uuid.dto';
import { SetCurrentUser } from '../../main/oem-users/oem-users.decorators/set-current-user.decorator';

@Crud({
  model: {
    type: QuoteAndVendoUuid,
  },
  params: {
    uuidType: {
      field: 'quoteAndVendoUuidType',
      type: 'string',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
  },
  routes: {
    only: ['getOneBase', 'getManyBase'],
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
@ApiBearerAuth('JWT-auth')
@ApiTags('Quotes')
@Controller('quote-and-vendo-uuids')
@SetCurrentUser
export class OemQuoteAndVendoUuidsController
  implements CrudController<QuoteAndVendoUuid>
{
  constructor(public service: OemQuoteAndVendoUuidsService) {}
}
