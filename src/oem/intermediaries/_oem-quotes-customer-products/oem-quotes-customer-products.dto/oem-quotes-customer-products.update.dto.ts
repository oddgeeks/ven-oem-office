import { PaymentTermEnum } from '../oem-quotes-customer-products.enums/payment-term.enum';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { OmitType } from '@nestjs/swagger';
import { QuotesCustomerProductsDto } from './oem-quotes-customer-products.dto';

export class QuotesCustomerProductsUpdateDto extends OmitType(
  QuotesCustomerProductsDto,
  ['customerProductId', 'quoteId'],
) {
  @IsOptional()
  lockedFields: object;
  @IsOptional()
  customerProductUuid: string;
  @IsOptional()
  isLocked: boolean;

  /*/!**
   * Is enabled
   * @example true
   *!/
  @IsBoolean()
  @IsOptional()
  isEnabled: boolean;*/
}

export { QuotesCustomerProductsDto as OemQuotesCustomerProductsDto };
