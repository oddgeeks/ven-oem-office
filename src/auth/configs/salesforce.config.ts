import { registerAs } from '@nestjs/config';
import { ISalesforceConfig } from './interfaces/salesforce-config.interface';
import { NODE_ENV } from '../../environments';

export default registerAs('salesforce', (): ISalesforceConfig => {
  const authorizationURL =
    NODE_ENV === 'production'
      ? 'https://login.salesforce.com/services/oauth2/authorize'
      : 'https://test.salesforce.com/services/oauth2/authorize';
  // `${process.env.SALESFORCE_URL}/services/oauth2/authorize`

  const tokenURL =
    NODE_ENV === 'production'
      ? 'https://login.salesforce.com/services/oauth2/token'
      : 'https://test.salesforce.com/services/oauth2/token';

  const profileURL =
    NODE_ENV === 'production'
      ? 'https://login.salesforce.com/services/oauth2/userinfo'
      : 'https://test.salesforce.com/services/oauth2/userinfo';

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
