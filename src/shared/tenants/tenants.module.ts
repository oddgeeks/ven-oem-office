import { Global, Module } from '@nestjs/common';

import { TenantsService } from './tenants.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OemCompanyEntity } from '../../oem/main/oem-companies/oem-company.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([OemCompanyEntity], 'MASTER_CONNECTION')],
  providers: [TenantsService],
  exports: [TenantsService],
})
export class TenantsModule {}
