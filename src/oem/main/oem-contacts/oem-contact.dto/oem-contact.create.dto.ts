import { OmitType } from '@nestjs/swagger';
import { ContactDto } from './oem-contact.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class ContactCreateDto extends OmitType(ContactDto, [
  'contactId',
  'quotesContacts',
  'vendosContacts',
  'isEnabled',
  'updatedAt',
  'createdAt',
] as const) {}

export { ContactCreateDto as OemContactCreateDto };
