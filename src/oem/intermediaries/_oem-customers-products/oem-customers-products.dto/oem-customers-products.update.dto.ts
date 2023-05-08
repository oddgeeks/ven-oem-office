import { OmitType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CustomersProductsDto } from './oem-customers-products.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class CustomersProductsUpdateDto extends OmitType(
  CustomersProductsDto,
  [] as const,
) {
  @IsOptional()
  quantity: number;
  @IsOptional()
  endDate: Date | string;
  @IsOptional()
  customerPrice: number;
  @IsOptional()
  netPrice: number;
  @IsOptional()
  sfParentAssetId: string;
  @IsOptional()
  sfAssetId: string;
}

export { CustomersProductsUpdateDto as OemCustomersProductsUpdateDto };
