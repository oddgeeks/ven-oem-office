import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';
import { OemQuotesContactsService } from './oem-quotes-contacts.service';
import { OemQuotesContacts } from './oem-quotes-contacts.entity';
import { dto } from './oem-quotes-contacts.dto';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { InjectSubHierarchyInterceptor } from '../../../common/interceptors/inject-sub-hierarchy.interceptor';
import { SetCurrentUser } from '../../main/oem-users/oem-users.decorators/set-current-user.decorator';

@Crud({
  model: {
    type: OemQuotesContacts,
  },
  params: {
    id: {
      field: 'quoteId',
      type: 'number',
    },
    contactId: {
      field: 'contactId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    join: {
      quote: {
        eager: false,
      },
      contact: {
        eager: false,
      },
    },
  },
  routes: {
    only: ['replaceOneBase', 'deleteOneBase', 'getManyBase', 'getOneBase'],
  },
  dto,
})
@ApiTags('Quotes')
@Controller('/quotes/:id/contacts/')
@UseGuards(SessionAuthGuard, JWTAuthGuard)
@ApiBearerAuth('JWT-auth')
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
export class OemQuotesContactsController
  implements CrudController<OemQuotesContacts>
{
  constructor(public service: OemQuotesContactsService) {}
}
