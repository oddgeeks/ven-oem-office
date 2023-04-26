import { OmitType } from '@nestjs/swagger';
import { ContactDto } from './oem-contact.dto';
import { ContactTypeEnum } from '../oem-contact.enums/contact-type.enum';
import { IsOptional } from 'class-validator';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class ContactUpdateDto extends OmitType(ContactDto, [
  'contactId',
  'quotesContacts',
  'vendosContacts',
  'isEnabled',
  'updatedAt',
  'createdAt',
] as const) {
  /* @IsOptional()
   contactType: ContactTypeEnum;*/
  @IsOptional()
  companyOrganisationName: string;
  @IsOptional()
  jobTitle: string;
  @IsOptional()
  lastName: string;
  @IsOptional()
  firstName: string;
  @IsOptional()
  contactEmail: string;
  @IsOptional()
  phone: string;
}

export { ContactUpdateDto as OemContactUpdateDto };
