import { ContactDto } from './oem-contact.dto';
import { PartialType } from '@nestjs/swagger';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class ContactSerializeDto extends PartialType(ContactDto) {}

export { ContactSerializeDto as OemContactSerializeDto };
