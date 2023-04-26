import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import {
  OemRolesVisibleProductFields,
  RolesVisibleProductFields,
} from './oem-roles-visible-product-fields.entity';
import { CrudRequest } from '@nestjsx/crud';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';

@Injectable()
@CommonDefaultMethodExtension
export class OemRolesVisibleProductFieldsService extends TypeOrmCrudService<OemRolesVisibleProductFields> {
  constructor(@InjectRepository(OemRolesVisibleProductFields) repo) {
    super(repo);
  }
  deleteOne(req: CrudRequest): Promise<void | RolesVisibleProductFields> {
    return super.deleteOne(req);
  }
}
