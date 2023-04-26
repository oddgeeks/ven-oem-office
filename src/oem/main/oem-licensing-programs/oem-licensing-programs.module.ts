import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OemLicensingProgramsService } from './oem-licensing-programs.service';
import { OemLicensingProgramEntity } from './oem-licensing-program.entity';
import { OemLicensingProgramsController } from './oem-licensing-programs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OemLicensingProgramEntity])],
  providers: [OemLicensingProgramsService],
  exports: [OemLicensingProgramsService],
  controllers: [OemLicensingProgramsController],
})
export class OemLicensingProgramsModule {}
