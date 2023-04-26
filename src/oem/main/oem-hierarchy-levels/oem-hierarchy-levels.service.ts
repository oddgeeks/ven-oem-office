import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { OemHierarchyLevelEntity } from './oem-hierarchy-level.entity';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';

@Injectable()
@CommonDefaultMethodExtension
export class OemHierarchyLevelsService extends TypeOrmCrudService<OemHierarchyLevelEntity> {
  constructor(@InjectRepository(OemHierarchyLevelEntity) public repo) {
    super(repo);
  }
}
