import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemUserEntity } from './oem-user.entity';
import { OemUsersService } from './oem-users.service';
import { OemUsersController } from './oem-users.controller';
import {
  IsUserEmailAlreadyExist,
  IsPhoneAlreadyExist,
  IsUserEnabled,
} from './oem-user.validators/oem-user.validator';
/*import { ACService } from '../../auth/acls/acls.service';
import { acRules } from '../../auth/acls/acls.rules';*/
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([OemUserEntity])],
  providers: [
    OemUsersService,
    IsUserEmailAlreadyExist,
    IsPhoneAlreadyExist,
    IsUserEnabled,
  ],
  exports: [
    OemUsersService,
    IsUserEmailAlreadyExist,
    IsPhoneAlreadyExist,
    IsUserEnabled,
  ],
  controllers: [OemUsersController],
})
export class OemUsersModule {}
