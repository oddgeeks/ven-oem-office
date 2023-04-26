import { IsString, IsOptional, MinLength, Matches } from 'class-validator';

export class OpportunityAccountGetDto {
  @IsString()
  @MinLength(10)
  @Matches(/^[0-9][0-9a-zA-Z]+$/, {
    message: 'Invalid Opportunity ID',
  })
  idOpportunity: string;

  @IsString()
  @IsOptional()
  idAccount?: string;
}
