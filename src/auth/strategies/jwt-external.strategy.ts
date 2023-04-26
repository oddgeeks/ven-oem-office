import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { AuthService } from '../auth.service';
import { User } from '../../oem/main/oem-users/oem-user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtExternalStrategy extends PassportStrategy(
  Strategy,
  'jwt-external',
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken() ||
        ExtractJwt.fromUrlQueryParameter('access_token'),
      secretOrKey: process.env.APP_SECRET,
      ignoreExpiration: false,
      passReqToCallback: false,
    });
  }

  validate(
    payload: JwtPayload,
  ): Promise<Partial<Required<User> & { id_token: any }>> {
    return this.authService.verifyPayloadExternal(payload);
  }
}
