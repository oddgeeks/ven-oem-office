import { OmitType } from '@nestjs/swagger';
import { OemCustomerDto } from './oem-customer.dto';

import { IsOptional } from 'class-validator';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class CustomerUpdateDto extends OmitType(OemCustomerDto, [
  'customerId',
  'isEnabled',
  'createdAt',
  'updatedAt',
  'companyId',
  'customersProducts',
  'vendos',
  'customerAddresses',
] as const) {
  @IsOptional()
  licensingProgramId: number;

  @IsOptional()
  organizationId: string | null;

  @IsOptional()
  salesOrganizationId: string | null;

  @IsOptional()
  customerName: string;

  @IsOptional()
  industry: string;

  @IsOptional()
  customerEmail: string | null;

  @IsOptional()
  logoUrl: string | null;

  @IsOptional()
  phone: string | null;

  @IsOptional()
  companyId: number;
}

export { CustomerUpdateDto as OemCustomerUpdateDto };
