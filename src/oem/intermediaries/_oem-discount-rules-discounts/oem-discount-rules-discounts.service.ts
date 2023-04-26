import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { OemDiscountRulesDiscounts } from './oem-discount-rules-discounts.entity';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';

@Injectable()
@CommonDefaultMethodExtension
export class OemDiscountRulesDiscountsService extends TypeOrmCrudService<OemDiscountRulesDiscounts> {
  constructor(@InjectRepository(OemDiscountRulesDiscounts) repo) {
    super(repo);
  }
}
