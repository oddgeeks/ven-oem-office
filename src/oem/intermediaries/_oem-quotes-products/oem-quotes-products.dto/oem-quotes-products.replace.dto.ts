import { OmitType } from '@nestjs/swagger';
import { QuotesProductsDto } from './oem-quotes-products.dto';

export class QuotesProductsReplaceDto extends OmitType(QuotesProductsDto, [
  'endDate',
  'companyId',
]) {}

export { QuotesProductsReplaceDto as OemQuotesProductsReplaceDto };
