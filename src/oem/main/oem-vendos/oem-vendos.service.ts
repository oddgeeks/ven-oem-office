import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Connection, EntityManager, In, Repository } from 'typeorm';
import { CrudRequest } from '@nestjsx/crud';
import * as _ from 'lodash';
import * as fs from 'fs';
import * as moment from 'moment-timezone';

import { OemVendoEntity } from './oem-vendo.entity';
import { OemVendoApprovalQueuesService } from '../../intermediaries/_oem-approval-queues/_oem-vendo-approval-queues/oem-vendo-approval-queues.service';
import { OemVendoUpdateDto } from './oem-vendo.dto/oem-vendo.update.dto';
import { OemVendoReplaceDto } from './oem-vendo.dto/oem-vendo.replace.dto';
import { OemRecentlyViewedQuotesVendos } from '../../intermediaries/_oem-recently-viewed-quotes-vendos/oem-recently-viewed-quotes-vendos.entity';
import { VendoStatusEnum } from './oem-vendo.enums/vendo-status.enum';
import { ToTypeEnum } from '../oem-quotes/oem-quote.enums/to.enum';
import { ActionLogs } from '../oem-action-logs/oem-action-logs.decorators/action-logs.decorator';
import { ActionLogTypeEnum } from '../oem-action-logs/oem-action-log.enums/action-log-types.enum';
import { ActionsEnum } from '../oem-action-logs/oem-action-log.enums/actions.enum';
import { OemQuoteAndVendoUuidsService } from '../../intermediaries/_oem-quote-and-vendo-uuids/oem-quote-and-vendo-uuids.service';
import { UuidTypesEnum } from '../../intermediaries/_oem-quote-and-vendo-uuids/oem-quote-and-vendo.enums/uuid-types.enum';
import { OemUserEntity } from '../oem-users/oem-user.entity';
import { PdfMergerService } from '../../../shared/pdf-merger/pdf-merger.service';
import { PDFExporterService } from '../../../shared/pdf-exporter/pdf-exporter.service';
import { ExportType } from '../../../shared/pdf-exporter/types/export-type';
import { PdfData } from '../../../shared/pdf-exporter/types/pdf-data';
import { getVendoPdfData } from '../../../shared/pdf-exporter/mock-vendo-data';
import { FilenameService } from '../../../shared/s3-upload/services/filename-generator/filename-generator.service';
import { UploaderService } from '../../../shared/s3-upload/services/uploader/uploader.service';
import { OemVendosUsers } from '../../intermediaries/_oem-vendos-users/oem-vendos-users.entity';
import { QueuesService } from '../../../shared/queues/queues.service';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';
import { SetCloneMethod } from '../../../common/decorators/set-clone-method.decorator';
import { OemQuoteCreateDto } from '../oem-quotes/oem-quote.dto/oem-quote.create.dto';
import { OemQuoteEntity } from '../oem-quotes/oem-quote.entity';
import { OemVendoCreateDto } from './oem-vendo.dto/oem-vendo.create.dto';
import { OemQuoteAndVendoUuid } from '../../intermediaries/_oem-quote-and-vendo-uuids/oem-quote-and-vendo-uuid.entity';
import { OemCompanyEntity } from '../oem-companies/oem-company.entity';

//TODO: WE NEED COMBINE submit method for quote and vendo (using abstraction)
@Injectable()
@CommonDefaultMethodExtension
@SetCloneMethod([
  'VendosContacts',
  'VendosMaterials',
  'VendosQuotes',
  'VendosUsers',
])
export class OemVendosService extends TypeOrmCrudService<OemVendoEntity> {
  constructor(
    private connection: Connection,
    @InjectRepository(OemVendosUsers)
    public vendoUsersRepo: Repository<OemVendosUsers>,
    @InjectRepository(OemVendoEntity)
    public repo: Repository<OemVendoEntity>,
    @InjectRepository(OemCompanyEntity)
    public repoCompany: Repository<OemCompanyEntity>,
    private vendoApprovalQueuesService: OemVendoApprovalQueuesService,
    @InjectRepository(OemRecentlyViewedQuotesVendos)
    private readonly usersViewedVendos: Repository<OemRecentlyViewedQuotesVendos>,
    private quoteAndVendoUuidsService: OemQuoteAndVendoUuidsService,
    private pdfExporter: PDFExporterService,
    private readonly pdfMerger: PdfMergerService,
    private readonly filenameGenerator: FilenameService,
    private readonly uploader: UploaderService,
    @Inject('BUCKET_NAME')
    private readonly bucketName: string,
    private queuesService: QueuesService,
  ) {
    super(repo);
    //this.exportTestPdf(1);
  }

  //TODO: we really need to have EVENT SYSTEM to control it
  async _markVendoAsViewed(user: any, vendoId: number) {
    const { userId, companyId } = user;
    const recentlyViewedVendo = await this.usersViewedVendos.findOne({
      where: {
        userId,
        companyId,
        vendoId,
      },
    });

    if (recentlyViewedVendo) {
      await this.usersViewedVendos.save(
        this.usersViewedVendos.create({
          ...recentlyViewedVendo,
          updatedAt: new Date(),
        }),
      );
    } else {
      await this.usersViewedVendos.save(
        this.usersViewedVendos.create({
          userId,
          companyId,
          vendoId,
        }),
      );
    }
  }

  private async _createOne(req: CrudRequest, dto: Partial<OemVendoCreateDto>) {
    const uuid = await this._updateVendoUUID(dto);

    dto.vendoUuid = uuid.prefix + uuid.lastUuid;

    const company = await this.repoCompany.findOne({
      companyId: dto['companyId'],
    });

    const expiresAt =
      (company?.defaultQuoteExpiration &&
        moment.utc().add(company.defaultQuoteExpiration, 'days').toDate()) ||
      moment.utc().add(3, 'months').toDate();

    dto.expiresAt = dto.expiresAt || expiresAt;

    // console.log(expiresAt);

    return super.createOne.call(this, req, dto);
  }

  async getOne(req: CrudRequest): Promise<any> {
    return this.repo.manager.connection.transaction(async (manager) => {
      let dynamicResponse = { isApprovalTurn: false };
      const vendo = await super.getOne(req);
      const user = req['user'];

      try {
        const vendoApprovalQueue =
          await this.vendoApprovalQueuesService.repo.findOne({
            userId: user.userId,
            vendoId: vendo.vendoId,
            isActive: true,
          });

        const validatedQuoteApprovalQueue =
          vendoApprovalQueue &&
          (await this.vendoApprovalQueuesService.validate(
            req,
            vendoApprovalQueue.vendoApprovalQueueId,
            {},
            manager,
          ));

        if (validatedQuoteApprovalQueue) {
          dynamicResponse = { isApprovalTurn: true };
        }
      } catch (error) {
        console.error('Get One Vendo - Dynamic isApprovalTurn Field', error);
      }

      await this._markVendoAsViewed(req['user'], vendo.vendoId);

      return { ...vendo, ...dynamicResponse };
    });
  }

  /**
   * Auto-increments vendo UUID
   * @private
   */
  private async _updateVendoUUID(dto): Promise<OemQuoteAndVendoUuid> {
    return this.quoteAndVendoUuidsService.updateUuid(UuidTypesEnum.VENDO, dto);
  }

  @ActionLogs(ActionLogTypeEnum.VENDO, ActionsEnum.CREATE)
  async createOne(
    req: CrudRequest,
    dto: Partial<OemVendoCreateDto>,
  ): Promise<OemVendoEntity> {
    const uuid = await this._updateVendoUUID(dto);
    dto.vendoUuid = uuid.prefix + uuid.lastUuid;
    return this._createOne(req, dto);
  }

  // async getMany(req: CrudRequest): Promise<OemVendoEntity[]> {
  //   return (await super.getMany(req)) as OemVendoEntity[];
  // }

  @ActionLogs(ActionLogTypeEnum.VENDO, ActionsEnum.SUBMIT)
  async submit(
    req: Partial<
      CrudRequest & {
        user: OemUserEntity;
        externalUsers?: Array<OemUserEntity>;
      }
    >,
    vendoId: number,
    to: ToTypeEnum,
    externalUserIds?: Array<number>,
  ): Promise<any> {
    return this.connection.transaction(async (manager) => {
      const vendo = await this.repo.findOne(vendoId);
      if (!vendo) throw new NotFoundException('Vendo not found');

      // We are nullifying vendoName on clone, so need to validate on submit
      if (!vendo.vendoName) {
        throw new BadRequestException('Vendo name should not be empty');
      }

      if (
        ![
          ToTypeEnum.INTERNAL,
          ToTypeEnum.EXTERNAL,
          ToTypeEnum.CUSTOMER,
        ].includes(to)
      ) {
        throw new BadRequestException(
          'Invalid submission: Must submit to internal, external or customer',
        );
      }
      // TODO: We ignore this for internally submitting for now
      if (
        //to !== ToTypeEnum.INTERNAL && //due of pdfExportQueue we disable it
        !vendo.customerId ||
        !vendo.opportunityId
      ) {
        throw new BadRequestException('Customer information is missing');
      }

      // permutations
      // ┌─────┬────────────────────────────┬──────────┬─────────────────────────────┬────────────────────────────┬────────────────┐
      // │  #  │      Original Status       │    to    │        Updated Status       │           Email            │      Note      │
      // ├─────┼────────────────────────────┼──────────┼─────────────────────────────┼────────────────────────────┼────────────────┤
      // │  1  │       Not Transacted       │ Internal │           Pending           │  Approval emails to users  │  resubmission  │
      // ├─────┼────────────────────────────┼──────────┼─────────────────────────────┼────────────────────────────┼────────────────┤
      // │  2  │            Draft           │ External │ Pending Customer Acceptance │ Approval email to customer │                │
      // ├─────┼────────────────────────────┼──────────┼─────────────────────────────┼────────────────────────────┼────────────────┤
      // │  3  │          Approved          │ External │ Pending Customer Acceptance │ Approval email to customer │                │
      // ├─────┼────────────────────────────┼──────────┼─────────────────────────────┼────────────────────────────┼────────────────┤
      // │  4  │         Transacted         │ Customer │              -              │  Transacted emails to all  │                │
      // └─────┴────────────────────────────┴──────────┴─────────────────────────────┴────────────────────────────┴────────────────┘

      const originalStatus = vendo.vendoStatus;
      const isPending =
        originalStatus !== VendoStatusEnum.TRANSACTED &&
        to === ToTypeEnum.INTERNAL;
      const isDraft =
        originalStatus === VendoStatusEnum.DRAFT && to === ToTypeEnum.EXTERNAL;
      const isApproved =
        originalStatus === VendoStatusEnum.APPROVED &&
        to === ToTypeEnum.EXTERNAL;
      const isPendingCustomerAcceptance =
        originalStatus === VendoStatusEnum.SENT_EXTERNALLY &&
        to === ToTypeEnum.EXTERNAL;
      const isTransacted =
        originalStatus === VendoStatusEnum.TRANSACTED &&
        to === ToTypeEnum.CUSTOMER;

      if (isPending) {
        vendo.vendoStatus = VendoStatusEnum.PENDING_INTERNAL_APPROVAL;
        vendo.isLocked = false;
        vendo.submittedAt = new Date();
      } else if (isDraft || isApproved) {
        vendo.vendoStatus = VendoStatusEnum.SENT_EXTERNALLY;
        vendo.isLocked = true;
        vendo.submittedAt = new Date();
      } else if (!isPendingCustomerAcceptance && !isTransacted) {
        throw new BadRequestException(
          "Invalid submission: status must not be 'pending customer acceptance' or 'transacted'",
        );
      }

      let externalUsers = [];

      if (externalUserIds && externalUserIds.length > 0)
        externalUsers = (
          await this.vendoUsersRepo.find({
            where: {
              vendoId: vendoId,
              userId: In(externalUserIds),
            },
            relations: ['user'],
          })
        ).map((vendoUser) => vendoUser.user);

      await manager.save(vendo);
      req.externalUsers = externalUsers;

      if (isPending) {
        this.queuesService.addPdfExportQueue({ vendoId });
      }

      await this.vendoApprovalQueuesService.vendoResubmitHandler(
        req,
        vendo,
        manager,
      );

      return vendo;
    });
  }

  private async _backToDraft(vendoId: number, manager: EntityManager) {
    const relations = this.repo.metadata.ownRelations.map(
      (relation) => relation.inverseEntityMetadata,
    );
    for (const relation of relations) {
      // console.log(relation.targetName, Object.keys(relation.propertiesMap));
      if (Object.keys(relation.propertiesMap).includes('isLocked')) {
        // console.log(`Unlock ${relation.targetName}`);
        await manager.update(
          relation.targetName,
          {
            vendoId,
            isLocked: true,
          },
          {
            isLocked: false,
          },
        );
      }
    }

    await this.vendoApprovalQueuesService.deactivateVendoApprovalQueues(
      vendoId,
      manager,
    );
  }

  async update(
    vendoId: number,
    dto: Partial<OemVendoUpdateDto>,
    manager: EntityManager,
  ) {
    const vendo = await this.repo.findOne(vendoId);
    if (!vendo) {
      throw new NotFoundException('Vendo not found');
    }

    let { isLocked } = vendo;
    const isBackToDraft =
      vendo.vendoStatus !== dto.vendoStatus &&
      dto.vendoStatus === VendoStatusEnum.DRAFT;

    if (isBackToDraft) {
      isLocked = false;
      await this._backToDraft(vendoId, manager);
    }

    const updatedVendo = await manager.save(
      this.repo.create({
        ...vendo,
        ...dto,
        submittedAt: new Date(),
        isLocked,
      }),
    );

    // allow updating vendoStatus only by submit for now
    // await this.vendoApprovalQueuesService.vendoResubmitHandler(
    //   updatedVendo,
    //   manager,
    // );

    return updatedVendo;
  }

  @ActionLogs(ActionLogTypeEnum.VENDO, ActionsEnum.UPDATE)
  async updateOne(
    req: CrudRequest,
    dto: Partial<OemVendoUpdateDto>,
  ): Promise<OemVendoEntity> {
    return this.connection.transaction(async (manager) => {
      const vendoId = req.parsed.paramsFilter.find(
        (params) => params.field === req.options.params.id.field,
      );

      return this.update(vendoId.value, dto, manager);
    });
  }

  @ActionLogs(ActionLogTypeEnum.VENDO, ActionsEnum.UPDATE)
  async replaceOne(
    req: CrudRequest,
    dto: Partial<OemVendoReplaceDto>,
  ): Promise<OemVendoEntity> {
    return this.connection.transaction(async (manager) => {
      const vendoId = req.parsed.paramsFilter.find(
        (params) => params.field === req.options.params.id.field,
      );

      const vendo = await this.repo.findOne(vendoId.value);

      if (!vendo.geoHierarchyId)
        vendo.geoHierarchyId = req['user'].geoHierarchyId;

      if (vendo) {
        return this.update(vendoId.value, dto, manager);
      }

      return super.replaceOne(req, dto);
    });
  }

  @ActionLogs(ActionLogTypeEnum.VENDO, ActionsEnum.DELETE)
  async deleteOne(req: CrudRequest) {
    const vendoId = req.parsed.paramsFilter.find(
      (params) => params.field === req.options.params.id.field,
    )?.value;
    const vendo = vendoId && (await this.repo.findOne(vendoId));
    if (!vendo) {
      throw new NotFoundException('Vendo not found');
    }

    return this.repo.manager.transaction(async (manager) => {
      const deactivatedVendo = await manager.save(
        this.repo.create({
          ...vendo,
          isEnabled: false,
        }),
      );

      const relations = this.repo.metadata.ownRelations
        .map((relation) => relation.inverseEntityMetadata)
        .filter(
          (relation) =>
            Object.keys(relation.propertiesMap).includes('vendoId') &&
            Object.keys(relation.propertiesMap).includes('isEnabled'),
        );
      for (const relation of relations) {
        const entities = await manager.find(relation.targetName, {
          vendoId,
        });
        for (const entity of entities) {
          await manager.save(
            manager.getRepository(relation.targetName).create({
              ...entity,
              isEnabled: false,
            }),
          );
        }
      }
      console.log(this.repo.metadata, this.repo.metadata.ownRelations);

      return deactivatedVendo;
    });
  }

  /**
   * @deprecated
   * @param originalVendo
   * @param manager
   */
  async getClonedData(originalVendo: OemVendoEntity, manager: EntityManager) {
    const quoteAndVendoUuid = await this.quoteAndVendoUuidsService.updateUuid(
      UuidTypesEnum.VENDO,
      {
        companyId: originalVendo.companyId,
      },
    );

    return {
      ..._.omit(originalVendo, [
        'vendoId',
        'vendoStatus',
        'createdAt',
        'updatedAt',
      ]),
      vendoUuid: quoteAndVendoUuid.uuid,
      isLocked: false,
      expiresAt: moment.utc().add(3, 'months').toDate(),
      vendoName:
        originalVendo.vendoName + ' - Cloned from ' + originalVendo.vendoUuid,
    };
  }

  async exportTestPdf(vendoId: number): Promise<any> {
    console.log('Generate test "Exported Vendo.pdf"');
    const pdfBuffer = await this.pdfExporter.generatePDF(
      ExportType.Vendo,
      getVendoPdfData(),
    );

    fs.writeFile('./Exported Vendo.pdf', pdfBuffer, (err) => {
      if (err) return console.error(err);
    });

    return true;
  }

  async generatePdf(vendo: OemVendoEntity) {
    const quotes = vendo.vendosQuotes.map((vendoQuote) => vendoQuote.quote);
    const vendoData: PdfData = {
      vendo,
      quotes,
      company: vendo.company,
      companyAddress: vendo.company.companyAddress.address,
    };

    const pdfBuffer = await this.pdfExporter.generatePDF(
      ExportType.Vendo,
      vendoData,
    );

    return pdfBuffer;
  }

  // For some reason this function is treated as promise, not sure why
  private _getPdfFileName(vendo: OemVendoEntity) {
    const { pdfFileUrl } = vendo;
    if (!pdfFileUrl) {
      return {
        oldName: null,
        newName: `${vendo.vendoUuid}-1.pdf`,
      };
    }

    // https://files.vendori.com/pdf/V-9831893828.pdf?Expires=1697858429
    const pdfFileNameMatch = pdfFileUrl.match(/V-[0-9]+[-0-9]*\.pdf/);
    const pdfFileName = pdfFileNameMatch && pdfFileNameMatch[0];
    const currentIndex =
      Number(
        pdfFileName?.replace(`${vendo.vendoUuid}-`, '').replace('.pdf', ''),
      ) || 0;

    return {
      oldName: pdfFileName,
      newName: `${vendo.vendoUuid}-${currentIndex + 1}.pdf`,
    };
  }

  // When exporting it uses this.repo.manager based on the current tenant.
  // When it’s called on pdf-export-queue, it would run with the super connection which is passed from the queue.
  async exportPdf(vendoId: number, manager = this.repo.manager): Promise<any> {
    const vendo = await manager
      .createQueryBuilder(OemVendoEntity, 'vendo')
      // main vendo data
      .innerJoinAndSelect('vendo.company', 'vCompany')
      .innerJoinAndSelect('vCompany.companyAddress', 'vCompanyAddress')
      .innerJoinAndSelect('vCompanyAddress.address', 'addressForVendoCompany')
      .leftJoinAndSelect('vendo.customer', 'vCustomer')
      .leftJoinAndSelect('vCustomer.customerAddresses', 'vCustomerAddresses')
      .leftJoinAndSelect('vCustomerAddresses.address', 'vCustomerAddress')
      .leftJoinAndSelect(
        'vendo.vendosUsers',
        'vendoUsers',
        'vendoUsers.isOwner = TRUE',
      )
      .leftJoinAndSelect('vendoUsers.user', 'vUser')
      .leftJoinAndSelect('vendo.vendosContacts', 'vendoContacts')
      .leftJoinAndSelect('vendoContacts.contact', 'vContact')
      // quotes
      .leftJoinAndSelect('vendo.vendosQuotes', 'vendoQuotes')
      .leftJoinAndSelect('vendoQuotes.quote', 'quote')
      .leftJoinAndSelect('quote.company', 'qCompany')
      .leftJoinAndSelect('qCompany.companyAddress', 'qCompanyAddress')
      .leftJoinAndSelect('qCompanyAddress.address', 'addressForQuoteCompany')
      .leftJoinAndSelect('quote.customer', 'qCustomer')
      .leftJoinAndSelect('qCustomer.customerAddresses', 'qCustomerAddresses')
      .leftJoinAndSelect('qCustomerAddresses.address', 'qCustomerAddress')
      .leftJoinAndSelect(
        'quote.usersQuotes',
        'quoteUsers',
        'quoteUsers.isOwner = TRUE',
      )
      .leftJoinAndSelect('quoteUsers.user', 'qUser')
      .leftJoinAndSelect('quote.quotesProducts', 'quoteProducts')
      .leftJoinAndSelect('quote.quotesContacts', 'quoteContacts')
      .leftJoinAndSelect('quoteContacts.contact', 'qContact')
      // to merge
      .leftJoinAndSelect('vendo.vendosMaterials', 'vendoMaterials')
      .leftJoinAndSelect('vendoMaterials.material', 'material')
      .where({ vendoId })
      .getOne();

    if (!vendo) {
      throw new NotFoundException('Invalid Vendo');
    }

    vendo.vendosQuotes.sort((a, b) =>
      moment.utc(a.createdAt).isBefore(moment.utc(b.createdAt)) ? -1 : 1,
    );
    vendo.vendosQuotes?.forEach((vendoQuote) =>
      vendoQuote.quote?.quotesProducts?.sort(
        (a, b) => a.quoteProductId - b.quoteProductId,
      ),
    );

    let pdfBuffer = await this.generatePdf(vendo);

    const vendoMaterials = vendo.vendosMaterials.sort(
      (vendoMaterial1, vendoMaterial2) =>
        vendoMaterial1.position - vendoMaterial2.position,
    );

    const materialsBefore = vendoMaterials
      .filter((vendoMaterial) => vendoMaterial.position < 0)
      .map((vendoMaterial) => vendoMaterial.material);

    const materialsAfter = vendoMaterials
      .filter((vendoMaterial) => vendoMaterial.position > 0)
      .map((vendoMaterial) => vendoMaterial.material);

    const pdfsBufffer: Array<Buffer> = [];

    if (materialsBefore?.length) {
      const materialsBeforePdfBuffer = await this.pdfMerger.downloadAndMerge(
        materialsBefore
          .filter((material) => !!material.fileUrl)
          .map((material) => material.fileUrl),
      );
      if (materialsBeforePdfBuffer) {
        pdfsBufffer.push(materialsBeforePdfBuffer);
      }
    }

    const vendoPDFLength = pdfsBufffer.push(pdfBuffer);
    const vendoPDFPosition = vendoPDFLength - 1;

    if (materialsAfter?.length) {
      const materialsAfterPdfBuffer = await this.pdfMerger.downloadAndMerge(
        materialsAfter
          .filter((material) => !!material.fileUrl)
          .map((material) => material.fileUrl),
      );
      if (materialsAfterPdfBuffer) {
        pdfsBufffer.push(materialsAfterPdfBuffer);
      }
    }

    if (pdfsBufffer.length > 1) {
      pdfBuffer = await this.pdfMerger.merge(pdfsBufffer, vendoPDFPosition);
    }

    // This is ridiculous, not sure why it's treated as promise. Maybe it's because functions are wrapped for multi-tenancy or something?
    const { oldName, newName } = await this._getPdfFileName(vendo);
    if (oldName) {
      // Delete in background not to delay the response and do not throw
      this.uploader
        .deleteObject({
          Bucket: this.bucketName,
          Key: oldName,
        })
        .catch((err) => console.error('Delete Old PDF Error', err));
    }

    const aYearFromNow = new Date();
    aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
    await this.uploader.putSignUrl({
      ContentType: 'PDF',
      Bucket: this.bucketName,
      Key: newName,
      Body: pdfBuffer,
      Expires: aYearFromNow,
    });
    const pdfFileUrl = await this.uploader.getSignUrl({
      Bucket: this.bucketName,
      ContentType: 'PDF',
      Key: newName,
    });

    await manager.update(OemVendoEntity, { vendoId }, { pdfFileUrl });

    return pdfFileUrl;
  }
}
