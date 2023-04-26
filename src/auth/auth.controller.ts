import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { Request } from 'express';
import { AuthUser } from '../oem/main/oem-users/oem-users.decorators/auth-user.decorator';
import { User } from '../oem/main/oem-users/oem-user.entity';
import { AuthService } from './auth.service';
import { UserCreateDto } from '../oem/main/oem-users/oem-user.dto/oem-user.create.dto';
import { JWTAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SessionAuthGuard } from './guards/session-auth.guard';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { UserSerializeDto } from '../oem/main/oem-users/oem-user.dto/oem-user.serialize.dto';
import { OpenidAuthGuard } from './guards/openid-auth.guard';
import { Issuer } from 'openid-client';
import { GoogleOauthGuard } from './guards/google-auth.guard';
import { LoginEmailDto } from './dto/login-email.dto';
import { RedirectFilter } from './filters/redirect.filter';
import { OemCompanyEntity } from '../oem/main/oem-companies/oem-company.entity';
import { SalesforceOauthGuard } from './guards/salesforce-auth.guard';

//TODO: add ConfigService
@ApiTags('Users')
@Controller('sessions')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ description: 'Register a user. *NOW WE ARE USING ONLY OKTA' })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(TokenInterceptor)
  register(@Body() signUp: UserCreateDto): Promise<UserSerializeDto> {
    return this.authService.register(signUp);
  }

  @ApiOperation({ description: 'Using okta token for getting a user' })
  @Post('login/okta')
  @HttpCode(HttpStatus.OK)
  //@UseGuards(LocalAuthGuard)
  @UseGuards(AuthGuard('bearer'))
  async loginOkta(@Req() req: Request): Promise<UserSerializeDto> {
    const token: string = req.headers?.authorization?.replace('Bearer ', '');
    return this.authService.oktaValidateToken(token);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ssoLoginEmail: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TokenInterceptor)
  async login(@AuthUser() user: User) {
    return this.authService.loginUser(user);
  }

  //todo: we need use interceptor serialization here
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    description: 'Returning a user from token/cookie.',
  })
  @Get('/me')
  @UseGuards(SessionAuthGuard, JWTAuthGuard)
  me(@AuthUser() user: User): UserSerializeDto {
    console.log(user, new UserSerializeDto(user));
    return new UserSerializeDto(user);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    description:
      'Returning current user accounts from all companies in system.',
  })
  @Get('/my-accounts')
  @UseGuards(SessionAuthGuard, JWTAuthGuard)
  getMyAccounts(@AuthUser() user: User): Promise<Array<OemCompanyEntity>> {
    return this.authService.getMyAccounts(user);
  }

  /**
   * We should SET ACCESS_TOKEN IN HEADERS like A BEARER TOKEN ! ! !
   */
  @ApiOperation({
    description:
      'Okta signIn, returns internal jwt-token by redirecting query param. Should be set like a bearer header in request.',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(OpenidAuthGuard)
  @Get('/login')
  @UseInterceptors(TokenInterceptor)
  loginOidc() {}

  /**
   * We should SET ACCESS_TOKEN IN HEADERS like A BEARER TOKEN ! ! !
   */
  @ApiOperation({
    description:
      'Google signIn, returns internal jwt-token by redirecting query param. Should be set like a bearer header in request.',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(GoogleOauthGuard)
  @Get('/login/google')
  @UseInterceptors(TokenInterceptor)
  loginGoogle() {}

  /**
   * We should SET ACCESS_TOKEN IN HEADERS like A BEARER TOKEN ! ! !
   */
  @ApiOperation({
    description:
      'Salesforce signIn, returns internal jwt-token by redirecting query param. Should be set like a bearer header in request.',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(SalesforceOauthGuard)
  @Get('/login/salesforce')
  @UseInterceptors(TokenInterceptor)
  loginSalesforce() {}

  /**
   * We should SET ACCESS_TOKEN IN HEADERS like A BEARER TOKEN ! ! !
   */
  //TODO: we should add DTO here for email validation
  @ApiOperation({
    description: 'Send an email with an authorization link',
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TokenInterceptor)
  @Get('/login/email')
  loginEmail(
    @Query() query: LoginEmailDto,
    // new ValidationPipe({
    //   transform: true,
    //   transformOptions: { enableImplicitConversion: true },
    //   forbidNonWhitelisted: true,
    // }),
  ): Promise<boolean> {
    return this.authService.emailLogin(query.email);
  }

  /**
   * Google Redirect
   */
  @UseGuards(SessionAuthGuard, GoogleOauthGuard)
  @UseFilters(RedirectFilter)
  @Get('/google/redirect')
  async loginGoogleCallback(@AuthUser() user: User, @Req() req, @Res() res) {
    const response = await this.authService.loginUser(user);
    const redirectPartLink = process.env.GOOGLE_FRONTEND_REDIRECT.split('://');
    //res.setHeader('Authorization', `Bearer ${response.access_token}`);
    res.redirect(
      `${redirectPartLink[0]}://${user.company.subdomain}.${redirectPartLink[1]}?access_token=${response.access_token}`,
    );
  }

  /**
   * SalesForce Redirect
   */
  @UseGuards(SessionAuthGuard, SalesforceOauthGuard)
  @UseFilters(RedirectFilter)
  @Get('/salesforce/redirect')
  async loginSalesforceCallback(
    @AuthUser() user: User,
    @Req() req,
    @Res() res,
  ) {
    const response = await this.authService.loginUser(user);
    const redirectPartLink = process.env.GOOGLE_FRONTEND_REDIRECT.split('://');
    res.setHeader('Authorization', `Bearer ${response.access_token}`);
    console.log(response);
    res.redirect(
      `${redirectPartLink[0]}://${user.company.subdomain}.${redirectPartLink[1]}?access_token=${response.access_token}`,
    );
  }

  /**
   * Okta Redirect
   */
  @UseGuards(SessionAuthGuard, OpenidAuthGuard)
  @Get('/authorization-code/callback')
  async loginOktaCallback(@AuthUser() user: User, @Req() req, @Res() res) {
    const response = await this.authService.loginUser(user);
    const redirectPartLink = process.env.OKTA_FRONTEND_REDIRECT.split('://');
    res.redirect(
      `${redirectPartLink[0]}://${user.company.subdomain}.${redirectPartLink[1]}?access_token=${response.access_token}`,
    );
  }

  @UseGuards(SessionAuthGuard, JWTAuthGuard)
  @Get('/logout')
  async logout(@Req() req, @Res() res) {
    const id_token = req.user ? req.user.id_token : undefined;
    req.logout();
    const TrustIssuer = await Issuer.discover(
      `${process.env.OKTA_ISSUER}/.well-known/openid-configuration`,
    );
    req.session.destroy(null, (code) => {
      const end_session_endpoint = TrustIssuer.metadata.end_session_endpoint;
      // console.log(end_session_endpoint +
      //   '&post_logout_redirect_uri=' +
      //   process.env.OKTA_LOGOUT_REDIRECT_URI +
      //   (id_token ? '&id_token_hint=' + id_token : ''));

      if (end_session_endpoint) {
        res.redirect(
          end_session_endpoint +
            '?post_logout_redirect_uri=' +
            process.env.OKTA_LOGOUT_REDIRECT_URI +
            (id_token ? '&id_token_hint=' + id_token : ''),
        );
      } else {
        res.redirect('/');
      }
      return code;
    });
  }
}
