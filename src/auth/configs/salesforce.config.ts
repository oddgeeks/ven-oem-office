import { registerAs } from '@nestjs/config';
import { ISalesforceConfig } from './interfaces/salesforce-config.interface';

export default registerAs('salesforce', (): ISalesforceConfig => {
  const authorizationURL = `${process.env.SALESFORCE_URL}/services/oauth2/authorize`;
  const tokenURL = `${process.env.SALESFORCE_URL}/services/oauth2/token`;
  const profileURL = `${process.env.SALESFORCE_URL}/services/oauth2/userinfo`;

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
