import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Connection } from 'typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionSerializer } from '../common/serializers/session.serializer';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { OktaStrategy } from './strategies/okta.strategy';
import { OemUsersService } from '../oem/main/oem-users/oem-users.service';
import { getConnectionToken } from '@nestjs/typeorm';
import { OemUserEntity } from '../oem/main/oem-users/oem-user.entity';
import { OemHierarchiesModule } from '../oem/main/oem-hierarchies/oem-hierarchies.module';
import {
  buildOpenIdClient,
  OpenidStrategy,
} from './strategies/openid.strategy';
import { IOidcConfig } from './configs/interfaces/oidc-config.interface';
import { IGoogleConfig } from './configs/interfaces/google-config.interface';
import { OemCompanyEntity } from '../oem/main/oem-companies/oem-company.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './strategies/google.strategy';
import { SalesforceStrategy } from './strategies/salesforce.strategy';

import oktaOidcConfig from './configs/okta.oidc.config';
import googleConfig from './configs/google.config';
import salesForceConfig from './configs/salesforce.config';
import { JwtExternalStrategy } from './strategies/jwt-external.strategy';
import { ISalesforceConfig } from './configs/interfaces/salesforce-config.interface';

const OidcStrategyFactory = {
  provide: 'OpenidStrategy',
  useFactory: async (authService: AuthService, oidcConfig: ConfigService) => {
    const client = await buildOpenIdClient(oidcConfig.get<IOidcConfig>('okta')); // secret sauce! build the dynamic client before injecting it into the strategy for use in the constructor super call.
    const strategy = new OpenidStrategy(
      authService,
      oidcConfig.get<IOidcConfig>('okta'),
      client,
    );
    return strategy;
  },
  inject: [AuthService, ConfigService],
};

const GoogleStrategyFactory = {
  provide: 'GoogleStrategy',
  useFactory: async (authService: AuthService, config: ConfigService) => {
    const strategy = new GoogleStrategy(
      authService,
      config.get<IGoogleConfig>('google'),
    );
    return strategy;
  },
  inject: [AuthService, ConfigService],
};

const SalesforceStrategyFactory = {
  provide: 'SalesforceStrategy',
  useFactory: async (authService: AuthService, config: ConfigService) => {
    const strategy = new SalesforceStrategy(
      authService,
      config.get<ISalesforceConfig>('salesforce'),
    );
    return strategy;
  },
  inject: [AuthService, ConfigService],
};

@Module({
  imports: [
    OemHierarchiesModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule.forRoot({
      load: [oktaOidcConfig, googleConfig, salesForceConfig],
    }),
    //Todo should use config service
    JwtModule.register({
      secret: process.env.APP_SECRET,
      signOptions: {
        expiresIn: '1d',
        algorithm: 'HS384',
      },
      verifyOptions: {
        algorithms: ['HS384'],
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    OemUsersService,
    {
      provide: 'UserRepository',
      useFactory: (connection: Connection) =>
        connection.getRepository(OemUserEntity),
      inject: [getConnectionToken('MASTER_CONNECTION')],
    },
    {
      provide: 'CompanyRepository',
      useFactory: (connection: Connection) =>
        connection.getRepository(OemCompanyEntity),
      inject: [getConnectionToken('MASTER_CONNECTION')],
    },
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtExternalStrategy,
    SessionSerializer,
    OktaStrategy,
    OidcStrategyFactory,
    GoogleStrategyFactory,
    SalesforceStrategyFactory,
  ],
  exports: [AuthService],
})
export class AuthModule {}
