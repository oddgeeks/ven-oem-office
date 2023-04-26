import { registerAs } from '@nestjs/config';
import { IGoogleConfig } from './interfaces/google-config.interface';

export default registerAs(
  'google',
  (): IGoogleConfig => ({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CLIENT_REDIRECT,
    scope: ['email'],
  }),
);
