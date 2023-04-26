/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const NODE_ENV = process.env.NODE_ENV || 'development';
if (!process.env.DB_MAIN_DATABASE) {
  require('dotenv').config({
    path: path.resolve(__dirname, `./.env.${NODE_ENV}`),
  });
}

const distPrefix = process.env.NODE_ENV === 'test' ? '' : '/dist';

// https://stackoverflow.com/questions/59435293/typeorm-entity-in-nestjs-cannot-use-import-statement-outside-a-module
// If you are using an ormconfig.json instead, you should use
// entities: ["dist/**/*.entity.js"]
// so that you are using the compiled js files and have no chance to use the ts files in your code.

// To use typeorm-seeding, we need to use dist/js files for nestjs and use ts files for tests
// To prevent the issue with the typeorm migration cli which reads orm.environments.ts by default, named it differently - orm-master.environments.js

console.log(
  'orm-master.environments.js',
  'NODE_ENV',
  NODE_ENV,
  // 'DB_MAIN_HOST',
  // process.env.DB_MAIN_HOST,
  // 'DB_MAIN_PORT',
  // process.env.DB_MAIN_PORT,
  // 'DB_MAIN_USERNAME_MASTER',
  // process.env.DB_MAIN_USERNAME_MASTER,
  // 'DB_MAIN_PASSWORD_MASTER',
  // process.env.DB_MAIN_PASSWORD_MASTER,
  'DB_MAIN_DATABASE',
  process.env.DB_MAIN_DATABASE,
);

module.exports = {
  name: 'MASTER_CONNECTION_CONF',
  type: 'postgres',
  host: process.env.DB_MAIN_HOST,
  port: Number(process.env.DB_MAIN_PORT),
  username: process.env.DB_MAIN_USERNAME_MASTER,
  password: process.env.DB_MAIN_PASSWORD_MASTER,
  database: process.env.DB_MAIN_DATABASE,
  synchronize: false,
  dropSchema: false,
  logging: false,
  // entities: ['./src/oem/**/*.entity{.ts,.js}'],
  entities: [
    path.join(__dirname, `.${distPrefix}/src/oem/**/*.entity{.ts,.js}`),
  ],
  // migrations: ['./src/oem/migrations/**/*{.ts,.js}}'],
  migrations: [
    path.join(__dirname, `.${distPrefix}/src/oem/migrations/**/*{.ts,.js}}`),
  ],
  // seeds: ['./src/oem/seeds/index.seed{.ts,.js}'],
  seeds: [
    path.join(__dirname, `.${distPrefix}/src/oem/seeds/index.seed{.ts,.js}`),
  ],
  // factories: ['./src/oem/**/*.factory{.ts,.js}'],
  factories: [
    path.join(__dirname, `.${distPrefix}/src/oem/**/*.factory{.ts,.js}`),
  ],
  cli: {
    // migrationsDir: './src/oem/migrations',
    migrationsDir: `.${distPrefix}/src/oem/migrations`,
  },
};
