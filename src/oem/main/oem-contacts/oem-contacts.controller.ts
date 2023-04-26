import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  Crud,
  CrudAuth,
  CrudController,
  CrudRequest,
  ParsedRequest,
} from '@nestjsx/crud';
import { OemContactEntity } from './oem-contact.entity';
import { OemContactsService } from './oem-contacts.service';
import { dto, serialize } from './oem-contact.dto';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { SetCurrentUser } from '../oem-users/oem-users.decorators/set-current-user.decorator';

@Crud({
  model: {
    type: OemContactEntity,
  },
  params: {
    id: {
      field: 'contactId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
    join: {
      quotesContacts: {
        eager: false,
      },
      vendosContacts: {
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
@ApiTags('Users')
@Controller('contacts')
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
export class OemContactsController implements CrudController<OemContactEntity> {
  constructor(public service: OemContactsService) {}

  @Get('salesforce/list')
  getSFContacts(@ParsedRequest() req: CrudRequest) {
    return this.service.fetchSFContacts(req);
  }
}
