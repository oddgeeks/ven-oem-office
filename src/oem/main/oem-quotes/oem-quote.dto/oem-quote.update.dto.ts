import { OmitType } from '@nestjs/swagger';
import { IsOptional, Validate } from 'class-validator';

import { QuoteDto } from './oem-quote.dto';
import { DealTypeEnum } from '../oem-quote.enums/deal-type.enum';
import { IQuoteAttributes } from '../oem-quote.interfaces/quote-attributes.interface';
import { IQuoteInternalCommentFiles } from '../oem-quote.interfaces/quote-internal-comment-files.interface';
import { StatusUpdateValidator } from '../oem-quote.validators/status-update.validator';
import { QuoteStatusEnum } from '../oem-quote.enums/quote-status.enum';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class QuoteUpdateDto extends OmitType(QuoteDto, [
  'quoteId',
  'companyId',
  'submittedAt',
  'daysSinceSubmission',
  'isEnabled',
  'createdAt',
  'pinCode',
  'updatedAt',
] as const) {
  @IsOptional()
  customerId: number;
  @IsOptional()
  geoHierarchyId: number;
  @IsOptional()
  quoteUuid: string;
  @IsOptional()
  opportunityId: string;
  @IsOptional()
  sfContractId: string;
  @IsOptional()
  quoteName: string;
  @IsOptional()
  netAmount: number;
  @IsOptional()
  dealType: DealTypeEnum;
  @IsOptional()
  currency: string;
  @IsOptional()
  quoteComments: string | null;
  @IsOptional()
  quoteInternalComments: string | null;
  @IsOptional()
  quoteInternalCommentFiles: IQuoteInternalCommentFiles[];
  @IsOptional()
  quoteAttributes: IQuoteAttributes[];
  @IsOptional()
  pdfFileUrl: string;
  @IsOptional()
  excelFileURL: string;
  @IsOptional()
  isAcceptingCreditCard: boolean;
  @IsOptional()
  isRequiringSigning: boolean;
  @IsOptional()
  isBlackBox: boolean;
  @IsOptional()
  isLocked: boolean;
  @IsOptional()
  isExternal: boolean;
  @IsOptional()
  isDistributorVisible: boolean;
  @IsOptional()
  isResellerVisible: boolean;
  @IsOptional()
  isExternalHideInvoice: boolean;
  @IsOptional()
  isExternalHideUnit: boolean;
  @IsOptional()
  isExternalHideContact: boolean;
  @IsOptional()
  lockedFields: object;
  @IsOptional()
  isPrimary: boolean;

  @Validate(StatusUpdateValidator)
  quoteStatus: QuoteStatusEnum;
}

export { QuoteUpdateDto as OemQuoteUpdateDto };
