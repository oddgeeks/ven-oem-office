import { Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ContactTypeEnum } from '../oem-contact.enums/contact-type.enum';
import { OemQuotesContacts } from '../../../intermediaries/_oem-quotes-contacts/oem-quotes-contacts.entity';
import { OemVendosContacts } from '../../../intermediaries/_oem-vendos-contacts/oem-vendos-contacts.entity';
import {
  IsAlpha,
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ContactDto {
  /**
   * The id of Contact
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  contactId: number;

  /*/!**
   * The contact type
   * @example Internal
   *!/
  @IsEnum(ContactTypeEnum)
  contactType: ContactTypeEnum;*/

  /**
   * The name of Company to which contact is to be made
   * @example VDF-43
   */
  @IsString()
  @MaxLength(64)
  companyOrganisationName: string;

  /**
   * The name of Job
   * @example Sales
   */
  @IsString()
  @MaxLength(128)
  jobTitle: string;

  /**
   * The fisrt name
   * @example Mike
   */
  @IsString()
  @IsAlpha()
  @MaxLength(32)
  lastName: string;

  /**
   * The name of Job
   * @example Fast
   */
  @IsString()
  @IsAlpha()
  @MaxLength(32)
  firstName: string;

  /**
   * The name of Job
   * @example example@example.com
   */
  @IsEmail()
  @MaxLength(128)
  contactEmail: string;

  /**
   * The phone
   * @example "+1 929 279-9165"
   */
  //@IsPhoneNumber()
  @MaxLength(36)
  @IsOptional()
  phone: string;

  /**
   * Is enabled
   * @example true
   */
  @IsBoolean()
  isEnabled: boolean;

  /**
   * The date of contact creating
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  createdAt: Date | string;

  /**
   * The date of contact updating
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  updatedAt: Date | string;

  /**
   * The array of quote contacts
   * @example []
   */
  @IsArray()
  @Type(() => OemQuotesContacts)
  quotesContacts: OemQuotesContacts[];

  /**
   * The array of vendo contacts
   * @example []
   */
  @IsArray()
  @Type(() => OemVendosContacts)
  vendosContacts: OemVendosContacts[];

  /**
   * The name of Company to which contact is to be made
   * @example 003DN000002lX8GYAU
   */
  @IsString()
  @IsOptional()
  sfContactId: string;
}

export { ContactDto as OemContactDto };
