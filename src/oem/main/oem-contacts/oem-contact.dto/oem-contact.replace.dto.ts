import { OmitType } from '@nestjs/swagger';
import { ContactDto } from './oem-contact.dto';
/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class ContactReplaceDto extends OmitType(ContactDto, [
  'quotesContacts',
  'vendosContacts',
  'isEnabled',
  'updatedAt',
  'createdAt',
] as const) {}

export { ContactReplaceDto as OemContactReplaceDto };
