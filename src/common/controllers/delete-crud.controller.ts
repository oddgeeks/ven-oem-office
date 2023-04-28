import {
  Body,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  Action,
  CrudRequest,
  CrudRequestInterceptor,
  ParsedRequest,
} from '@nestjsx/crud';

import { RoleActions } from '../../auth/roles/types/role-actions.enum';
import { BulkIdsDto } from '../dtos/bulk-ids.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

export class DeleteCrudController {
  public service: any;

  @ApiOperation({
    description:
      'Bulk delete set array <entityId> (depends on your Entity) with relations.',
  })
  @ApiBody({ type: BulkIdsDto })
  @HttpCode(HttpStatus.OK)
  @Post(`bulk-delete`)
  @Action(RoleActions.DeleteBulk)
  @UseInterceptors(CrudRequestInterceptor)
  deleteBulkBase(@ParsedRequest() req: CrudRequest, @Body() dto: BulkIdsDto) {
    return this.service.deleteBulk(req, dto);
  }
}
