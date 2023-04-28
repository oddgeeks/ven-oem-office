import { registerAs } from '@nestjs/config';
import { ISalesforceConfig } from './interfaces/salesforce-config.interface';
import { NODE_ENV } from '../../environments';

export default registerAs('salesforce', (): ISalesforceConfig => {
  const baseURL =
    NODE_ENV === 'production'
      ? 'https://login.salesforce.com/services/oauth2'
      : 'https://test.salesforce.com/services/oauth2';

  const authorizationURL = `${baseURL}/authorize`; // `${process.env.SALESFORCE_URL}/services/oauth2/authorize`
  const tokenURL = `${baseURL}/token`;
  const profileURL = `${baseURL}/userinfo`;

  return {
    clientID: process.env.OAUTH2_SALESFORCE_CLIENT_ID,
    clientSecret: process.env.OAUTH2_SALESFORCE_CLIENT_SECRET,
    callbackURL: process.env.OAUTH2_SALESFORCE_CLIENT_REDIRECT,
    authorizationURL,
    tokenURL,
    profileURL,
    scope: ['email'],
  };
});
