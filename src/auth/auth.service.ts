import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { OemUserEntity, User } from '../oem/main/oem-users/oem-user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { OemUsersService } from '../oem/main/oem-users/oem-users.service';
import * as OktaJwtVerifier from '@okta/jwt-verifier';
import { OemHierarchiesService } from '../oem/main/oem-hierarchies/oem-hierarchies.service';
import { OktaUserinfo } from './interfaces/okta-userinfo.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { OemCompanyEntity } from '../oem/main/oem-companies/oem-company.entity';
import { ILike, Repository } from 'typeorm';
import { EmailDynamicTemplate, EmailMessage } from '../shared/email/email.type';
import {
  APP_ROOT_URL,
  MAIL_USER_INVITE_TEMPLATE_ID,
  VENDORI_COMPANY_ADDRESS,
  VENDORI_LOGO_URL,
  VENDORI_SUPPORT_EMAIL,
} from '../environments';
import { sendGridEmailWithDynamicTemplate } from '../shared/email';
// import { SetCurrentTenant } from '../oem/tenants/tenants.decorators/set-current-tenant.decorator';
// import { InjectConnection } from '@nestjs/typeorm';

//TODO: seems like a it requires a little refactoring
@Injectable()
//@SetCurrentTenant
export class AuthService {
  private oktaVerifier: OktaJwtVerifier;
  private audience: string;

  constructor(
    // @InjectConnection('MASTER_CONNECTION')
    @InjectRepository(OemCompanyEntity)
    private readonly company: Repository<OemCompanyEntity>,
    @Inject(OemUsersService)
    private readonly userService: OemUsersService,
    @Inject(OemHierarchiesService)
    private readonly hierarchyService: OemHierarchiesService,
    @Inject(JwtService)
    private readonly jwtService: JwtService,
  ) {
    this.oktaVerifier = new OktaJwtVerifier({
      issuer: process.env.OKTA_ISSUER,
      clientId: process.env.OKTA_CLIENTID,
    });

    this.audience = process.env.OKTA_AUDIENCE;
  }

  async getMyAccounts(user: OemUserEntity): Promise<Array<OemCompanyEntity>> {
    return this.company.find({
      join: { alias: 'companies', innerJoin: { accounts: 'companies.users' } },
      where: (qb) => {
        qb.where({
          isEnabled: true,
        }).andWhere('accounts.ssoLoginEmail = :ssoLoginEmail', {
          ssoLoginEmail: user.ssoLoginEmail,
        }); // Filter related field
      },
    });
  }

  async oktaValidateToken(token: string): Promise<any> {
    let user: OemUserEntity;
    try {
      const jwt = await this.oktaVerifier.verifyAccessToken(
        token,
        this.audience,
      );
      const email: string = jwt.claims.sub;

      user = await this.userService.findOne({
        where: { ssoLoginEmail: email, isEnabled: true, isActive: true },
        relations: ['role'],
      });
      if (!user) {
        throw new UnauthorizedException(
          `There isn't any user with email: ${email}`,
        );
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException(
        `The token is invalid or user with provided email doesn't exist`,
      );
    }
  }

  async register(signUp: Partial<OemUserEntity>): Promise<User> {
    const user = await this.userService.register(signUp);
    delete user.password;

    return user;
  }

  async login(email: string, password: string): Promise<OemUserEntity> {
    let user: OemUserEntity;
    try {
      user = await this.userService.findOne({
        where: { ssoLoginEmail: email, isEnabled: true, isActive: true },
      });
    } catch (err) {
      throw new UnauthorizedException(
        `There isn't any user with email: ${email}`,
      );
    }
    // console.log(await user.checkPassword(password));
    if (!user) {
      throw new UnauthorizedException(
        `There isn't any user with email: ${email}`,
      );
    }

    if (!(await user.checkPassword(password))) {
      throw new UnauthorizedException(
        `Wrong password for user with email: ${email}`,
      );
    }
    delete user.password;

    return user;
  }

  private async _registerNewUser(
    payload: OktaUserinfo,
  ): Promise<OemUserEntity> {
    const domain = payload.preferred_username
      .split('@')
      .pop()
      .split('.')
      .shift()
      .replace(/[^a-z0-9]/g, '')
      .toLowerCase();

    /**
     * 4.09.22 I rewrote it bc - it seems like we would have a sql injection
     */
    const company = await this.company
      .createQueryBuilder()
      .where({ isEnabled: true })
      .andWhere(
        'LOWER( "Company".subdomain ) ILIKE :domain OR "Company".email_domain ILIKE :domain',
        { domain: `%${domain}%` },
      )
      .getOne();

    if (!company)
      throw new UnauthorizedException(
        `There is no such company domain : ${domain}`,
      );

    const user = await this.register({
      companyId: company.companyId,
      firstName: payload.given_name,
      geoHierarchyId: 2,
      roleId: 2,
      organizationId: null,
      prePopulatedFields: ['Full Name'],
      imageUrl: null,
      lastName: payload.family_name,
      notificationEmail: payload.preferred_username,
      ssoLoginEmail: payload.preferred_username,
      password: null,
      phone: null,
      isExternal: false,
      region: payload.zoneinfo,
      timeZoneArea: payload.zoneinfo,
      isHideWelcomeText: false,
      isActive: true,
      isEnabled: true,
    });

    user.company = company;

    return user;
  }

  public async oktaLogin(
    payload: Partial<JwtPayload & OktaUserinfo>,
  ): Promise<Partial<Required<OemUserEntity> & { id_token: any }>> {
    let user: OemUserEntity = await this.verifyPayload(payload);

    if (!user) user = await this._registerNewUser(payload as OktaUserinfo);

    return {
      id_token: payload.id_token,
      ...user,
    };
  }

  public async emailLogin(email: string): Promise<boolean> {
    try {
      const user: OemUserEntity = await this.verifyPayload({ username: email });
      //TODO: all const text should be in separated files
      const subject = `Your email login link`;

      const login = await this.loginUser(user);
      const redirectPartLink = process.env.EMAIL_FRONTEND_REDIRECT.split('://');

      //TODO: we really need to have a separated email service!!!
      const dynamicTemplateData: EmailDynamicTemplate = {
        logoURL: VENDORI_LOGO_URL,
        CTA: `${redirectPartLink[0]}://${user.company.subdomain}.${redirectPartLink[1]}?access_token=${login.access_token}`,
        subject: subject,
        body: `To login to Vendori, please click the link below`,
        companyAddress: VENDORI_COMPANY_ADDRESS,
        emailverify: `This message was sent to ${email} because you're a user in the ${user.fullName} Vendori account.`,
        showButton: true,
        ctaText: `Login`,
      };

      const emailMessage: EmailMessage = {
        subject,
        from: {
          name: 'Vendori',
          email: VENDORI_SUPPORT_EMAIL,
        },
        to: [
          {
            name: user.fullName,
            email: user.ssoLoginEmail,
          },
        ],
        templateId: MAIL_USER_INVITE_TEMPLATE_ID,
        dynamicTemplateData,
      };

      if (user) await sendGridEmailWithDynamicTemplate(emailMessage);
      else {
        new UnauthorizedException(`This user is not found: ${email}`);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Email Login Error', error);
      throw new UnauthorizedException(`Cannot login via email: ${email}`);
    }
  }

  async verifyPayload(payload: Partial<JwtPayload>): Promise<OemUserEntity> {
    let user: OemUserEntity;

    try {
      user = await this.userService.repo.findOne({
        where: [
          {
            ssoLoginEmail: payload.username,
            isEnabled: true,
            isActive: true,
            // isExternal: false,
          },
          {
            ssoLoginEmail: ILike(`%${payload.username}%`),
            isEnabled: true,
            isActive: true,
            isExternal: false,
          },
          {
            notificationEmail: ILike(`%${payload.username}%`),
            isEnabled: true,
            isActive: true,
            isExternal: false,
          },
          // {
          //   ssoLoginEmail: ILike(`%${payload.username.split('@')[0]}%`),
          //   notificationEmail: ILike(`%${payload.username.split('@')[0]}%`),
          // },
        ],
        relations: ['role', 'company'],
      });
    } catch (error) {
      console.error('User Email Login Error', error);

      throw new UnauthorizedException(
        `Cannot verify payload: ${payload.username}`,
      );
    }

    if (!user) {
      throw new UnauthorizedException(
        `Cannot verify payload (attempt #2): ${payload.username}`,
      );
    }

    return user;
  }

  async verifyPayloadExternal(
    payload: Partial<JwtPayload>,
  ): Promise<OemUserEntity> {
    let user: OemUserEntity;
    try {
      user = await this.userService.repo.findOne({
        where: {
          ssoLoginEmail: payload.username,
          isEnabled: true,
          isActive: true,
          // isExternal: true,
        },
        relations: ['role', 'company'],
      });
    } catch (error) {
      throw new UnauthorizedException(
        `Cannot verify external payload: ${payload.username}`,
      );
    }
    return user;
  }

  async signToken(user: OemUserEntity): Promise<string> {
    const payload = {
      sub: user.ssoLoginEmail,
    };

    return this.jwtService.sign(payload);
  }

  async loginUser(user: any) {
    const payload = {
      username: user.ssoLoginEmail,
      sub: user.userId,
      id_token: user.id_token,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
