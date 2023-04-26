import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { OemVisibleProductFieldEntity } from './oem-visible-product-field.entity';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';

@Injectable()
@CommonDefaultMethodExtension
export class OemVisibleProductFieldsService extends TypeOrmCrudService<OemVisibleProductFieldEntity> {
  constructor(@InjectRepository(OemVisibleProductFieldEntity) public repo) {
    super(repo);
  }
}
