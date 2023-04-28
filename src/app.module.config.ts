import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from '../src/oem/config/orm.config';
import ormConfigMaster from '../src/oem/config/orm-master.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

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
    forwardRef(() => AppModule),
  ],
  controllers: [],
  providers: [],
  exports: [],
})

export class AppModuleConfig {}
