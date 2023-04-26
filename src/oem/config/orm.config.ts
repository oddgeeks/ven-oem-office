import { join } from 'path';
import { isNil } from '@nestjsx/util';
import { ConfigModule, registerAs } from '@nestjs/config';

const ENV = process.env.NODE_ENV;
//TODO: need to create a separate config service for TypeORM
ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: !ENV ? '.env' : `.env.${ENV}`,
});

export const ormConfig = {
  type: 'postgres',
  extra: {
    decimalNumbers: true,
  },
  host: process.env.DB_MAIN_HOST,
  port: Number(process.env.DB_MAIN_PORT),
  username: process.env.DB_MAIN_USERNAME,
  password: process.env.DB_MAIN_PASSWORD,
  database: process.env.DB_MAIN_DATABASE,
  dropSchema:
    process.env.NODE_ENV === 'production'
      ? false
      : !isNil(process.env.TYPEORM_DROP_SCHEMA)
      ? !!parseInt(process.env.TYPEORM_DROP_SCHEMA, 10)
      : true,
  synchronize:
    process.env.NODE_ENV === 'production'
      ? false
      : !isNil(process.env.TYPEORM_SYNCHRONIZE)
      ? !!parseInt(process.env.TYPEORM_DROP_SCHEMA, 10)
      : true,
  logging:
    !isNil(process.env.TYPEORM_LOGGING) &&
    String(process.env.TYPEORM_LOGGING) == 'true',
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../migrations/**/*{.ts,.js}')],
  seeds: [join(__dirname, '../seeds/index.seed{.ts,.js}')],
  factories: [join(__dirname, '../**/*.factory{.ts,.js}')],
  cli: {
    migrationsDir: join(__dirname, '../migrations'),
  },
};
export default registerAs('ormConfig', () => ormConfig);
