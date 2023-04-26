import {
  IsString,
  IsNumber,
  IsNotEmpty,
  MinLength,
  Matches,
} from 'class-validator';

export class OemOpportunityAccountGetDto {
  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  @IsString()
  @MinLength(10)
  @IsNotEmpty()
  @Matches(/^[0-9][0-9a-zA-Z]+$/, {
    message: 'Invalid Opportunity ID',
  })
  idOpportunity: string;
}
