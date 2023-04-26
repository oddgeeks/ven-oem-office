import { Body, HttpCode, HttpStatus, Param, Post, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiProperty } from '@nestjs/swagger';
import { Action, CrudController, CrudRequest, CrudRequestInterceptor, ParsedRequest } from '@nestjsx/crud';

import { RoleActions } from '../../auth/roles/types/role-actions.enum';
import { BulkIdsDto } from '../dtos/bulk-ids.dto';
import { Quote } from '../../oem/main/oem-quotes/oem-quote.entity';

export class CloneCrudController {
  public service: any;
  @ApiParam({
    name: 'id',
    schema: {
      type: 'number',
    },
  })
  @ApiOperation({ description: 'Clone current entity with relations' })
  @HttpCode(HttpStatus.CREATED)
  @Post(`:id/clone`)
  @Action(RoleActions.Clone)
  @UseInterceptors(CrudRequestInterceptor)
  cloneBase(@ParsedRequest() req: CrudRequest) {
    return this.service.clone(req);
  }
  @ApiOperation({
    description:
      'Bulk clone set array <entityId> (depends on your Entity) with relations',
  })
  @ApiBody({ type: BulkIdsDto })
  @HttpCode(HttpStatus.CREATED)
  @Post(`bulk-clone`)
  @Action(RoleActions.CloneBulk)
  @UseInterceptors(CrudRequestInterceptor)
  cloneBulkBase(@ParsedRequest() req: CrudRequest, @Body() dto: BulkIdsDto) {
    return this.service.cloneBulk(req, dto);
  }
}
