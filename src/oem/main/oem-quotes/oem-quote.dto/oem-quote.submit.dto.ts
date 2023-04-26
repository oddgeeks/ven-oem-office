import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { ToTypeEnum } from '../oem-quote.enums/to.enum';

export class QuoteSubmitDto {
  /**
   * The ids of external users
   * optional
   * @example [1,2]
   */
  @IsArray()
  @IsOptional()
  externalUserIds?: Array<number>;
  /**
   * The submit subject
   * @example External
   */
  @IsEnum(ToTypeEnum)
  to: ToTypeEnum;
}

/**
 * make more clear for swagger DTO (without OEM prefix)
 * we remove oem prefix form class name due keeping DTO clear in docs, but provided as Oem for keeping context
 */
export { QuoteSubmitDto as OemQuoteSubmitDto };
