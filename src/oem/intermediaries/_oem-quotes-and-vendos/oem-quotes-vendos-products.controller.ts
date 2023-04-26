import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  Crud,
  CrudAuth,
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { AuthUser } from '../../main/oem-users/oem-users.decorators/auth-user.decorator';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { OemQuotesVendosProductsService } from './oem-quotes-vendos-products.service';
import { OemRecentlyViewedQuotesVendos } from '../_oem-recently-viewed-quotes-vendos/oem-recently-viewed-quotes-vendos.entity';
import { InjectSubHierarchyInterceptor } from '../../../common/interceptors/inject-sub-hierarchy.interceptor';

//TODO: We should move each endpoint to separated folder

@Crud({
  model: {
    type: OemRecentlyViewedQuotesVendos,
  },
  params: {
    id: {
      field: 'recentlyViewedId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
    join: {
      ownerUser: {
        eager: false,
      },
      customer: {
        eager: false,
      },
      geoHierarchy: {
        eager: false,
      },
      usersQuotes: {
        eager: false,
      },
      vendosUsers: {
        eager: false,
      },
    },
    sort: [],
  },
  routes: {
    only: ['getManyBase'],
  },
})
@ApiBearerAuth('JWT-auth')
@ApiTags('Quotes')
@UseGuards(SessionAuthGuard, JWTAuthGuard)
@UseInterceptors(InjectSubHierarchyInterceptor)
@CrudAuth({
  filter: (req) => {
    const conditions = [
      {
        'geoHierarchy.hierarchyId': req.user.geoHierarchyId,
        'geoHierarchy.isActive': true,
        'geoHierarchy.isEnabled': true,
        isEnabled: true,
      },
    ].concat(
      req.user.subHierarchies.map((h) => ({
        'geoHierarchy.hierarchyId': h.hierarchyId,
        'geoHierarchy.isActive': true,
        'geoHierarchy.isEnabled': true,
        isEnabled: true,
      })),
    );
    return {
      $or: conditions,
    };
  },
  persist: () => ({
    isEnabled: true,
  }),
})
@Controller('quotes-vendos-products')
export class OemQuotesVendosProductsController {
  constructor(public service: OemQuotesVendosProductsService) {}

  @ApiOperation({ description: 'Return quotes, vendos and products' })
  @Override()
  @HttpCode(HttpStatus.OK)
  getMany(@ParsedRequest() req) {
    return this.service.getMany(req);
  }
}
