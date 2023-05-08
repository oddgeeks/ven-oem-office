import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  Crud,
  CrudAuth,
  CrudController,
  CrudRequest,
  ParsedRequest,
  Feature,
  Action,
  Override,
  CrudRequestInterceptor,
} from '@nestjsx/crud';
import { ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';

import { OemQuoteEntity } from './oem-quote.entity';
import { OemQuotesService } from './oem-quotes.service';
import { dto, serialize } from './oem-quote.dto';
import { ToTypeEnum } from './oem-quote.enums/to.enum';
import { SetCurrentUser } from '../oem-users/oem-users.decorators/set-current-user.decorator';
import { OemQuoteSubmitDto } from './oem-quote.dto/oem-quote.submit.dto';
import { RolesGuard } from '../../../auth/roles/guards/roles.guard';
import { RoleActions } from '../../../auth/roles/types/role-actions.enum';
import { RoleSubjects } from '../../../auth/roles/types/role-subjects.type';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { CloneCrudController } from '../../../common/controllers/clone-crud.controller';
import { CurrentCompany } from '../oem-companies/oem-companies.decorators/company.decorator';
import { OemCompanyEntity } from '../oem-companies/oem-company.entity';
import { QuotePinCodeDto } from './oem-quote.dto/oem-quote.pin-code.dto';
import { SetController } from '../../../common/decorators/set-controller.decorator';
import { DeleteCrudController } from '../../../common/controllers/delete-crud.controller';
import { QuoteSalesforceUpdateDto } from '../../../shared/salesforce/salesforce.dto/quote.update.dto';

@Crud({
  model: {
    type: OemQuoteEntity,
  },
  params: {
    id: {
      field: 'quoteId',
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
      usersQuotes: {
        eager: true,
      },
      vendosQuotes: {
        eager: false,
      },
      ownerUser: {
        eager: false,
      },
      geoHierarchy: {
        eager: true,
      },
      customer: {
        eager: false,
      },
      'customer.customerAddresses': {
        eager: false,
      },
      quotesProducts: {
        eager: false,
      },
      quoteCustomerProducts: {
        eager: false,
      },
      quoteCompanyChannels: {
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
@ApiTags('Quotes')
@Controller('quotes')
@Feature(RoleSubjects.Quote)
@UseGuards(SessionAuthGuard, JWTAuthGuard, RolesGuard)
@CrudAuth({
  filter: (req: any) => {
    const filterObj = {
      // Need to return records in geos if they are inactive
      // 'geoHierarchy.isActive': true,
      companyId: req.user.companyId,
      'geoHierarchy.isEnabled': true,
      isEnabled: true,
    };

    return filterObj;
  },
  persist: (req) => ({
    companyId: req.user.companyId,
    isEnabled: true,
  }),
})
@ApiBearerAuth('JWT-auth')
@SetCurrentUser
@SetController([CloneCrudController, DeleteCrudController])
export class OemQuotesController implements CrudController<OemQuoteEntity> {
  constructor(public service: OemQuotesService) {}

  get base(): CrudController<OemQuoteEntity> {
    return this;
  }

  @Post(`export.test.pdf`)
  async exportTestPdf() {
    return this.service.exportTestPdf();
  }
  @ApiParam({
    name: 'id',
    schema: {
      type: 'number',
    },
  })
  @Post(`:id/export.pdf`)
  async exportPdf(@Param() param: { id: number }) {
    return this.service.exportPdf(param.id);
  }

  @ApiQuery({
    name: 'externalUserIds',
    schema: {
      type: 'array',
      items: {
        type: 'number',
      },
    },
  })
  @ApiQuery({
    name: 'to',
    schema: {
      enum: [ToTypeEnum.INTERNAL, ToTypeEnum.EXTERNAL, ToTypeEnum.CUSTOMER],
    },
  })
  @ApiParam({
    name: 'id',
    schema: {
      type: 'number',
    },
  })
  @Post(`:id/submit`)
  @Action(RoleActions.Submit)
  async submit(
    @ParsedRequest() req: CrudRequest,
    @Param() param: { id: number },
    @Query() query: OemQuoteSubmitDto,
  ) {
    return this.service.submit(req, param.id, query.to, query.externalUserIds);
  }

  @ApiParam({
    name: 'id',
    schema: {
      type: 'number',
    },
  })
  @UseInterceptors(CrudRequestInterceptor)
  @Post(`:id/pin-code/verify`)
  async verifyPinCode(
    @ParsedRequest() req: CrudRequest,
    @Body() dto: QuotePinCodeDto,
  ) {
    return this.service.verifyPinCode(req, dto);
  }

  @ApiParam({
    name: 'id',
    schema: {
      type: 'number',
    },
  })
  @UseInterceptors(CrudRequestInterceptor)
  @Post(`:id/update/salesforce`)
  async updateFromSalesforce(
    @ParsedRequest() req: CrudRequest,
    @Body() dto: QuoteSalesforceUpdateDto,
  ) {
    return this.service.updateFromSalesforce(req, dto);
  }

  @Override()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @Query() dto: OemQuoteEntity,
    @CurrentCompany() company: OemCompanyEntity,
  ) {
    return this.base.createOneBase(req, dto); //this.service.createOne.call(this, req, dto, company);
  }
}
