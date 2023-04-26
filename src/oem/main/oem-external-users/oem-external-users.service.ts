import { Injectable } from '@nestjs/common';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OemExternalUserEntity } from './oem-external-user.entity';

@Injectable()
@CommonDefaultMethodExtension
export class OemExternalUsersService extends TypeOrmCrudService<OemExternalUserEntity> {
  constructor(
    @InjectRepository(OemExternalUserEntity)
    repo: Repository<OemExternalUserEntity>,
  ) {
    super(repo);
  }
}
