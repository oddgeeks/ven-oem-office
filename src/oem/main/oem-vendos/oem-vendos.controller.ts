import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Controller, Param, Post, Query, UseGuards } from '@nestjs/common';
import {
  Crud,
  CrudAuth,
  CrudController,
  CrudRequest,
  ParsedRequest,
  Feature,
  Action,
} from '@nestjsx/crud';
import { OemVendoEntity } from './oem-vendo.entity';
import { OemVendosService } from './oem-vendos.service';
import { dto, serialize } from './oem-vendo.dto';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ToTypeEnum } from '../oem-quotes/oem-quote.enums/to.enum';
import { SetCurrentUser } from '../oem-users/oem-users.decorators/set-current-user.decorator';
import { RolesGuard } from '../../../auth/roles/guards/roles.guard';
import { RoleActions } from '../../../auth/roles/types/role-actions.enum';
import { RoleSubjects } from '../../../auth/roles/types/role-subjects.type';
import { CloneCrudController } from '../../../common/controllers/clone-crud.controller';
import { SetController } from '../../../common/decorators/set-controller.decorator';
import { DeleteCrudController } from '../../../common/controllers/delete-crud.controller';

@Crud({
  model: {
    type: OemVendoEntity,
  },
  params: {
    id: {
      field: 'vendoId',
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
      customer: {
        eager: false,
      },
      'customer.customerAddresses': { alias: 'customerAddresses' },
      'customer.customerAddresses.address': { alias: 'address' },
      vendosUsers: {
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
    },
  },
  routes: {
    exclude: ['createManyBase'],
  },
  dto,
  serialize,
})
@ApiBearerAuth('JWT-auth')
@ApiTags('Vendos')
@Controller('vendos')
@Feature(RoleSubjects.Vendo)
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
@SetCurrentUser
@SetController([CloneCrudController, DeleteCrudController])
export class OemVendosController implements CrudController<OemVendoEntity> {
  constructor(public service: OemVendosService) {}

  get base(): CrudController<OemVendoEntity> {
    return this;
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
    @Query() query,
  ) {
    return this.service.submit(req, param.id, query.to, query.externalUserIds);
  }

  @ApiParam({
    name: 'id',
    schema: {
      type: 'number',
    },
  })
  @Post(`:id/export.test.pdf`)
  async exportTestPdf(@Param() param: { id: number }) {
    return this.service.exportTestPdf(param.id);
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
}
