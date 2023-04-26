import { IsString } from 'class-validator';

export interface IQuoteCommentSettings {
  quoteDefaultComment: string;
  consumptionMessage: string;
}

export class QuoteCommentSettings implements IQuoteCommentSettings {
  constructor(
    data: IQuoteCommentSettings = {
      quoteDefaultComment: '',
      consumptionMessage: '',
    },
  ) {
    Object.assign(this, data);
  }

  @IsString()
  consumptionMessage!: string;
  @IsString()
  quoteDefaultComment!: string;
}
