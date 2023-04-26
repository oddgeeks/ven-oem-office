import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { OemActionLogEntity } from './oem-action-log.entity';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';
import { CrudRequest, GetManyDefaultResponse } from '@nestjsx/crud';
import { JoinRequest } from './oem-action-logs.decorators/join-request.decorator';
import { FilterNestedRequest } from './oem-action-logs.decorators/filter-nested-request.decorator';

@Injectable()
@CommonDefaultMethodExtension
export class OemActionLogsService extends TypeOrmCrudService<OemActionLogEntity> {
  constructor(@InjectRepository(OemActionLogEntity) public repo) {
    super(repo);
  }

  @JoinRequest([
    { value: 'association', nestedResponse: false },
    { value: 'subject', nestedResponse: true },
  ])
  async getOne(req: CrudRequest): Promise<OemActionLogEntity> {
    return super.getOne(req);
  }

  @FilterNestedRequest(['association', 'subject'])
  private _getManyOverride(
    req: CrudRequest,
  ): Promise<
    GetManyDefaultResponse<OemActionLogEntity> | OemActionLogEntity[]
  > {
    return super.getMany(req);
  }
  @JoinRequest([
    { value: 'association', nestedResponse: false },
    { value: 'subject', nestedResponse: true },
  ])
  async getMany(
    req: CrudRequest,
  ): Promise<
    GetManyDefaultResponse<OemActionLogEntity> | OemActionLogEntity[]
  > {
    return this._getManyOverride(req);
  }
}
