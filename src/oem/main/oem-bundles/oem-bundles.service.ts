import { Injectable } from '@nestjs/common';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OemBundleEntity } from './oem-bundle.entity';
import * as _ from 'lodash';
import { SetCloneMethod } from '../../../common/decorators/set-clone-method.decorator';

@Injectable()
@CommonDefaultMethodExtension
@SetCloneMethod([])
export class OemBundlesService extends TypeOrmCrudService<OemBundleEntity> {
  constructor(
    @InjectRepository(OemBundleEntity)
    public repo: Repository<OemBundleEntity>,
  ) {
    super(repo);
  }
  async updateOne(...args: any[]): Promise<OemBundleEntity> {
    const id = args[0].parsed.paramsFilter.find(
      (params) => params.field === args[0].options.params.id.field,
    );
    const newArgs = _.cloneDeep(args);
    newArgs[0].parsed.join = [];
    newArgs[1] = { ...newArgs[1], ['bundleId']: id.value };
    await super.updateOne.call(this, ...newArgs);
    return super.getOne({
      ...args[0],
    });
  }

  async replaceOne(...args: any[]): Promise<OemBundleEntity> {
    const id = args[0].parsed.paramsFilter.find(
      (params) => params.field === args[0].options.params.id.field,
    );
    const newArgs = _.cloneDeep(args);
    newArgs[0].parsed.join = [];
    newArgs[1] = { ...newArgs[1], ['bundleId']: id.value };
    await super.replaceOne.call(this, ...newArgs);
    return super.getOne({
      ...args[0],
    });
  }
}
