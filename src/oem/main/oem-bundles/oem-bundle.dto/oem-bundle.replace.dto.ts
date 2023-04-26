import { OmitType } from '@nestjs/swagger';
import { OemBundleDto } from './oem-bundle.dto';

class BundleReplaceDto extends OmitType(OemBundleDto, [
  'bundleId',
  'companyId',
  'customersProducts',
  'quotesBundles',
  'ownerUser',
  'productsRelationshipsSource',
  'productsRelationshipsTarget',
  'createdAt',
  'updatedAt',
  'isEnabled',
] as const) {}

export { BundleReplaceDto as OemBundleReplaceDto };
