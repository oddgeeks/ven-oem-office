import { IsNumber, IsNotEmpty } from 'class-validator';

export class OemContactListGetDto {
  @IsNumber()
  @IsNotEmpty()
  companyId: number;
}
