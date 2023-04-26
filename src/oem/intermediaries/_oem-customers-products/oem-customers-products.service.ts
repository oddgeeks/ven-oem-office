import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { OemCustomersProducts } from './oem-customers-products.entity';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';

@Injectable()
@CommonDefaultMethodExtension
export class OemCustomersProductsService extends TypeOrmCrudService<OemCustomersProducts> {
  constructor(@InjectRepository(OemCustomersProducts) repo) {
    super(repo);
  }
}
