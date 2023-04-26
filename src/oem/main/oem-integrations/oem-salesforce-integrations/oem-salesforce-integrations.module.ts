import { Module, Provider } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { OemSalesforceIntegrationEntity } from './oem-salesforce-integration.entity';
import { OemSalesforceIntegrationsService } from './oem-salesforce-integrations.service';
import { OemSalesforceIntegrationsController } from './oem-salesforce-integrations.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import cryptConfig from './oem-salesforce-integration.config/crypt.config';
import Cryptr = require('cryptr');
import { ISalesforceIntegrationConfig } from './oem-salesforce-integration.config/interfaces/salesforce-integration-config.interface';
import { Connection } from 'typeorm';

const CryptrServiceFactory: Provider = {
  provide: 'CryptrService',
  useFactory: async (Cryptr: Cryptr, config: ConfigService) => {
    const config_crypt = config.get<ISalesforceIntegrationConfig>('crypt');
    const cryptr = new Cryptr(config_crypt.secretKey, {
      pbkdf2Iterations: config_crypt.pbkdf2Iterations,
      saltLength: config_crypt.saltLength,
    });
    return cryptr;
  },
  inject: [Cryptr, ConfigService],
};

const CryptrInjectionFactory: Provider = {
  provide: getRepositoryToken(OemSalesforceIntegrationEntity),
  useFactory: (Cryptr: Cryptr, connection: Connection) => {
    OemSalesforceIntegrationEntity.prototype['_cryptr'] = Cryptr;
    return connection.getRepository(OemSalesforceIntegrationEntity);
  },
  inject: ['CryptrService', Connection],
};

const CryptrProvider: Provider = {
  provide: Cryptr,
  useValue: Cryptr,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([OemSalesforceIntegrationEntity]),
    ConfigModule.forRoot({
      load: [cryptConfig],
    }),
  ],
  providers: [
    OemSalesforceIntegrationsService,
    CryptrServiceFactory,
    CryptrInjectionFactory,
    CryptrProvider,
  ],
  exports: [OemSalesforceIntegrationsService],
  controllers: [OemSalesforceIntegrationsController],
})
export class OemSalesforceIntegrationsModule {}
