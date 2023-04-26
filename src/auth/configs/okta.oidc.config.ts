import { registerAs } from '@nestjs/config';
import { IOidcConfig } from './interfaces/oidc-config.interface';

export default registerAs(
  'okta',
  (): IOidcConfig => ({
    issuer: process.env.OKTA_ISSUER, //`https://dev-72650844.okta.com/`,
    client_id: process.env.OKTA_CLIENT_ID, //'0oa4yf90d4sYaIkXQ5d7',
    client_secret: process.env.OKTA_CLIENT_SECRET, //'EnlzgWaZjTCiOkwyH2rGI42rP2EISci0A8sAgRnu',
    redirect_uri: process.env.OKTA_CLIENT_REDIRECT, //'http://localhost:3000/sessions/authorization-code/callback',
    scope: process.env.OKTA_CLIENT_SCOPE, //'openid profile offline_access',
  }),
);
