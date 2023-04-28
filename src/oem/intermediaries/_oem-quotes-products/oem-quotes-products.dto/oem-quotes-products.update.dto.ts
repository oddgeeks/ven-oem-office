import { PaymentTermEnum } from '../oem-quotes-products.enums/payment-term.enum';
import { IsOptional } from 'class-validator';
import { OmitType } from '@nestjs/swagger';
import { QuotesProductsDto } from './oem-quotes-products.dto';

export class QuotesProductsUpdateDto extends OmitType(QuotesProductsDto, [
  'productId',
  'bundleId',
  'quoteId',
  'endDate',
  'companyId',
] as const) {
  @IsOptional()
  lockedFields: object;

  @IsOptional()
  invoiceSchedule: object;

  @IsOptional()
  customerProductUuid: string;

  @IsOptional()
  paymentTerm: PaymentTermEnum;

  @IsOptional()
  startDate: Date | string;

  @IsOptional()
  quantity: number;

  @IsOptional()
  isLocked: boolean;

  @IsOptional()
  companyId: number;
}

export { QuotesProductsUpdateDto as OemQuotesProductsUpdateDto };
