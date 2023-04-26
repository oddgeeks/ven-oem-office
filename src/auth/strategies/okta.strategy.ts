import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';

import { AuthService } from '../auth.service';
import { User } from '../../oem/main/oem-users/oem-user.entity';

@Injectable()
export class OktaStrategy extends PassportStrategy(Strategy, 'bearer') {
  constructor(private readonly authService: AuthService) {
    super();
  }
  async validate(token: string): Promise<User> {
    //console.log(token);
    return await this.authService.oktaValidateToken(token);
  }
}
