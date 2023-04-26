import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemExternalUserEntity } from './oem-external-user.entity';
import { OemExternalUsersService } from './oem-external-users.service';
import { OemExternalUsersController } from './oem-external-users.controller';
import { IsUserEnabled } from './oem-external-user.validators/oem-external-user.validator';

/*@Global()*/
@Module({
  imports: [TypeOrmModule.forFeature([OemExternalUserEntity])],
  providers: [OemExternalUsersService, IsUserEnabled],
  exports: [OemExternalUsersService, IsUserEnabled],
  controllers: [OemExternalUsersController],
})
export class OemExternalUsersModule {}
