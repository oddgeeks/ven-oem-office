import { ConfigModule } from '@nestjs/config';

const Index = process.env.NODE_ENV;

ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: !Index ? '.env' : `.env.${Index}`,
});
//TODO: need to add validation
export const {
  NODE_ENV,
  BUCKET_NAME,
  AWS_S3_SECRET_ACCESS_KEY,
  AWS_BUCKET_REGION,
  AWS_S3_SECRET_KEY_ID,
  SALESFORCE_LOGIN_URI,
  SALESFORCE_GRANT_TYPE,
  SALESFORCE_CLIENT_ID,
  SALESFORCE_CLIENT_SECRET,
  SALESFORCE_USERNAME,
  SALESFORCE_PASSWORD,
  TYPEORM_EXPLAIN,

  //postgres
  DB_MAIN_DATABASE,
  DB_MAIN_USERNAME,
  DB_MAIN_PASSWORD,

  // emails
  SENDGRID_API_KEY,
  MAIL_QUOTE_VENDO_CHANGE_TEMPLATE_ID,
  MAIL_CUSTOMER_UPDATE_TEMPLATE_ID,
  MAIL_BATCHED_UPDATE_TEMPLATE_ID,
  MAIL_USER_INVITE_TEMPLATE_ID,
  VENDORI_INTERNAL_RECEPTION_EMAIL,
  VENDORI_INTERNAL_SUPPORT_EMAIL,
  MAIL_QUOTE_CONFIRMATION_PATH,
  MAIL_VENDO_CONFIRMATION_PATH,

  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,

  // jwt auth
  APP_SECRET,

  // frontend root url
  APP_ROOT_URL,

  BULL_ADMIN_USERNAME,
  BULL_ADMIN_PASSWORD,
} = process.env;

export const BULL_HISTORY_TTL_HOURS = 7 * 24; // a week

export const VENDORI_COMPANY_ADDRESS =
  'Vendori, Inc. <br/> 1700 Northside Dr., Suite A7-2738, Atlanta, GA 30318';
export const VENDORI_SUPPORT_EMAIL = 'app@vendori.com';
export const VENDORI_LOGO_URL =
  'https://staging.vendori.com/images/DarkLogo.svg';

export const redis = {
  host: REDIS_HOST,
  port: Number(REDIS_PORT),
  password: REDIS_PASSWORD,

  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  reconnectOnError: (err: any) => {
    // https://github.com/luin/ioredis#reconnect-on-error
    if (err && err.message && err.message.includes('READONLY')) return true;

    return false;
  },
};

export const subdomain =
  NODE_ENV === 'production'
    ? 'app'
    : NODE_ENV === 'staging'
    ? 'staging'
    : NODE_ENV === 'mock'
    ? 'mock'
    : NODE_ENV === 'demo'
    ? 'demo'
    : 'app';
