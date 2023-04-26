import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  Client,
  UserinfoResponse,
  TokenSet,
  Issuer,
} from 'openid-client';
import { AuthService } from '../auth.service';
import { IOidcConfig } from '../configs/interfaces/oidc-config.interface';

export const buildOpenIdClient = async (config: IOidcConfig) => {
  const TrustIssuer = await Issuer.discover(
    `${config.issuer}/.well-known/openid-configuration`,
  );
  const client = new TrustIssuer.Client({
    client_id: config.client_id,
    client_secret: config.client_secret,
  });
  return client;
};

@Injectable()
export class OpenidStrategy extends PassportStrategy(Strategy, 'oidc') {
  constructor(
    private readonly authService: AuthService,
    private readonly config: IOidcConfig,
    private readonly client: Client,
  ) {
    super({
      client: client,
      params: {
        redirect_uri: config.redirect_uri,
        scope: config.scope,
      },
      passReqToCallback: false,
      usePKCE: false,
    });

    this.client = client;
  }

  async validate(tokenset: TokenSet): Promise<any> {
    try {
      const userinfo: UserinfoResponse = await this.client.userinfo(tokenset);
      const user = await this.authService.oktaLogin({
        username: userinfo.preferred_username,
        ...userinfo,
      });
      return {
        ...user,
        id_token: tokenset.id_token,
      };
      //TODO: add a logger
    } catch (error) {
      console.error('OpenidStrategy', error);
      throw new UnauthorizedException();
    }
  }
}
