/**
 * USE ONLY FOR TESTS
 */
process.env.NODE_ENV = 'test';
/**
 * https://github.com/facebook/jest/issues/11956
 * you would have limit in 4G, to fix it bump node to v.16.0.0
 */
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import ormConfig from '../src/oem/config/orm.config';
import ormConfigMaster from '../src/oem/config/orm-master.config';
import { AppModule } from '../src/app.module';
/*console.log = function() {}
console.debug = function() {}
console.error = function() {}*/
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig, ormConfigMaster],
    }),
    TypeOrmModule.forRootAsync({
      name: 'MASTER_CONNECTION',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('ormConfigMaster'),
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('ormConfig'),
      }),
    }),
    AppModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModuleTestConfig {}
