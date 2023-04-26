import {
  IsString,
  MaxLength,
  IsNumber,
  IsNotEmpty,
  IsEnum,
  IsBoolean,
  IsDate,
  IsArray,
  IsUrl,
  IsOptional,
  Validate,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

import { OemVendosQuotes } from '../../../intermediaries/_oem-vendos-quotes/oem-vendos-quotes.entity';
import { OemVendosUsers } from '../../../intermediaries/_oem-vendos-users/oem-vendos-users.entity';
import { VendoStatusEnum } from '../oem-vendo.enums/vendo-status.enum';
import { IsGeoHierarchy } from '../../oem-hierarchies/oem-hierarchy.validators/oem-hierarchy.validators';

export class VendoDto {
  /**
   * The id of Vendo
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  vendoId: number;

  /**
   * The id of Company
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  /**
   * The id of User
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  ownerUserId: number;

  /**
   * The id of Customer
   * @example 1
   */
  @IsNumber()
  @IsOptional()
  customerId: number;

  /**
   * The uuid of Vendo
   * @example e31hk1331k2kh31k2h
   */
  @IsNotEmpty()
  //@IsUUID()
  @IsOptional()
  @MaxLength(36)
  vendoUuid: string;

  /**
   * The opportunity id of User
   * @example 1
   */
  @IsString()
  @IsOptional()
  opportunityId: string | null;

  /**
   * The id of Geo Hierarchy
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  @Validate(IsGeoHierarchy)
  geoHierarchyId: number;

  /**
   * The pdf file
   * @example https://files.vendori.com/file.pdf
   */
  @IsString()
  @IsUrl()
  @MaxLength(256)
  @IsOptional()
  pdfFileUrl: string | null;

  /**
   * If external
   * @example true
   */
  @IsBoolean()
  @IsNotEmpty()
  isExternal: boolean;

  /**
   * The name of Vendo
   * @example test
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  vendoName: string | null;

  /**
   * The comments of Vendo
   * @example test
   */
  @IsString()
  @MaxLength(128)
  @IsOptional()
  vendoComments: string | null;

  /**
   * The vendo status
   * @example Pending
   */
  @IsString()
  @IsEnum(VendoStatusEnum)
  @IsOptional()
  vendoStatus: VendoStatusEnum;

  /**
   * Vendo expiration
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsNotEmpty()
  expiresAt: Date | string;

  /**
   * Vendo submitted date
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsOptional()
  submittedAt: Date | string;

  /**
   * The net amount
   * @example 100
   */
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  netAmount: number;

  /**
   * Vendo days since submission
   * @example "30 day(s)"
   */
  @IsString()
  daysSinceSubmission: string;

  /**
   * If enabled
   * @example true
   */
  @IsBoolean()
  isEnabled: boolean;

  /**
   * If locked box
   * @example true
   */
  @IsBoolean()
  isLocked: boolean;

  /**
   * The date of vendo creating
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  createdAt: Date | string;

  /**
   * The date of vendo updating
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  updatedAt: Date | string;

  /**
   * The array of quotes
   * @example []
   */
  @IsArray()
  @Type(() => OemVendosQuotes)
  vendosQuotes: OemVendosQuotes[];

  /**
   * The array of users
   * @example []
   */
  @IsArray()
  @Type(() => OemVendosUsers)
  vendosUsers: OemVendosUsers[];

  /*@ManyToOne(() => OemCustomers, (oemCustomers) => oemCustomers.oemVendos)
  @JoinColumn([{ name: 'customer_id', referencedColumnName: 'customerId' }])
  customer: OemCustomers;*/

  /*@OneToMany(
    () => OemVendosContacts,
    (oemVendosContacts) => oemVendosContacts.vendo,
  )
  oemVendosContacts: OemVendosContacts[];

  @OneToMany(
    () => OemVendosMaterials,
    (oemVendosMaterials) => oemVendosMaterials.vendo,
  )
  oemVendosMaterials: OemVendosMaterials[];*/
}

export { VendoDto as OemVendoDto };
