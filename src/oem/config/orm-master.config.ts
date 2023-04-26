import { ConfigModule, registerAs } from '@nestjs/config';
import { ormConfig } from './orm.config';

const ENV = process.env.NODE_ENV;

// ConfigModule.forRoot({
//   isGlobal: true,
//   envFilePath: [
//     '.env.development.test',
//     '.env.development.local',
//     '.env.development',
//   ],
// });

ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: !ENV ? '.env' : `.env.${ENV}`,
});

const ormMasterConfig = {
  ...ormConfig,
  username: process.env.DB_MAIN_USERNAME_MASTER,
  password: process.env.DB_MAIN_PASSWORD_MASTER,
};

export default registerAs('ormConfigMaster', () => ormMasterConfig);
