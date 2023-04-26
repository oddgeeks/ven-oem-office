import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemCompanyProgram } from './oem-company-program.entity';
import { OemCompanyProgramsService } from './oem-company-programs.service';
import { OemCompanyProgramsController } from './oem-company-programs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OemCompanyProgram])],
  providers: [OemCompanyProgramsService],
  exports: [OemCompanyProgramsService],
  controllers: [OemCompanyProgramsController],
})
export class OemCompanyProgramsModule {}
