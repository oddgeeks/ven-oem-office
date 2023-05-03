import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-salesforce-oauth2';
import { AuthService } from '../auth.service';
import { ISalesforceConfig } from '../configs/interfaces/salesforce-config.interface';

@Injectable()
export class SalesforceStrategy extends PassportStrategy(
  Strategy,
  'salesforce',
) {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ISalesforceConfig,
  ) {
    super({
      clientID: config.clientID,
      clientSecret: config.clientSecret,
      callbackURL: config.callbackURL,
      authorizationURL: config.authorizationURL,
      tokenURL: config.tokenURL,
      profileURL: config.profileURL,
      // scope: config.scope || ['email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { user_id, name, email, photos } = profile;

    const salesforceUser = {
      provider: 'salesforce',
      providerId: user_id,
      email: email,
      name: name,
      picture: photos.picture,
    };

    const user = await this.authService.verifyPayload({
      username: salesforceUser.email,
    });

    done(null, user);

    return {
      ...user,
    };
  }
}
