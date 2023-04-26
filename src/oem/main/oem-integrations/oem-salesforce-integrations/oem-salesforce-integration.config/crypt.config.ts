import { registerAs } from '@nestjs/config';
import { ISalesforceIntegrationConfig } from './interfaces/salesforce-integration-config.interface';

export default registerAs(
  'crypt',
  (): ISalesforceIntegrationConfig => ({
    secretKey: process.env.CRYPT_SECRET_KEY,
    pbkdf2Iterations: +process.env.CRYPT_PBKDF2ITERATIONS,
    saltLength: +process.env.CRYPT_SALT_LENGTH,
  }),
);
