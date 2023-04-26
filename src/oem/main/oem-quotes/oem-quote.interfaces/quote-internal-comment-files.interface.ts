import { IsUrl } from 'class-validator';

export interface IQuoteInternalCommentFiles {
  name: string;
  url: string;
}

export class QuoteInternalCommentFiles implements IQuoteInternalCommentFiles {
  name!: string;
  @IsUrl()
  url!: string;
}
