import { OmitType } from '@nestjs/swagger';
import { QuotesProductsDto } from './oem-quotes-products.dto';

export class QuotesProductsCreateDto extends OmitType(QuotesProductsDto, [
  'endDate',
  'companyId',
]) {}

export { QuotesProductsCreateDto as OemQuotesProductsCreateDto };
