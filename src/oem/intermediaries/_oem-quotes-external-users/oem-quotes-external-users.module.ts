import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemQuotesExternalUsers } from './oem-quotes-external-users.entity';
import { OemQuotesExternalUsersService } from './oem-quotes-external-users.service';
import { OemQuotesExternalUsersController } from './oem-quotes-external-users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OemQuotesExternalUsers])],
  providers: [OemQuotesExternalUsersService],
  exports: [OemQuotesExternalUsersService],
  controllers: [OemQuotesExternalUsersController],
})
export class OemQuotesExternalUsersModule {}
