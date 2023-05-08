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

import { OemQuoteEntity } from './oem-quote.entity';
import { PdfMergerService } from '../../../shared/pdf-merger/pdf-merger.service';
import { UploaderService } from '../../../shared/s3-upload/services/uploader/uploader.service';
import { FilenameService } from '../../../shared/s3-upload/services/filename-generator/filename-generator.service';
import { OemQuoteApprovalQueuesService } from '../../intermediaries/_oem-approval-queues/_oem-quote-approval-queues/oem-quote-approval-queues.service';
import { OemQuoteUpdateDto } from './oem-quote.dto/oem-quote.update.dto';
import { OemQuoteReplaceDto } from './oem-quote.dto/oem-quote.replace.dto';
import { OemRecentlyViewedQuotesVendos } from '../../intermediaries/_oem-recently-viewed-quotes-vendos/oem-recently-viewed-quotes-vendos.entity';
import { QuoteStatusEnum } from './oem-quote.enums/quote-status.enum';
import { SetCurrentTenant } from '../../../common/decorators/set-current-tenant.decorator';
import { ToTypeEnum } from './oem-quote.enums/to.enum';
import { ActionLogs } from '../oem-action-logs/oem-action-logs.decorators/action-logs.decorator';
import { ActionLogTypeEnum } from '../oem-action-logs/oem-action-log.enums/action-log-types.enum';
import { ActionsEnum } from '../oem-action-logs/oem-action-log.enums/actions.enum';
import { OemQuoteAndVendoUuidsService } from '../../intermediaries/_oem-quote-and-vendo-uuids/oem-quote-and-vendo-uuids.service';
import { UuidTypesEnum } from '../../intermediaries/_oem-quote-and-vendo-uuids/oem-quote-and-vendo.enums/uuid-types.enum';
import { OemUserEntity } from '../oem-users/oem-user.entity';
import { OemQuotesUsers } from '../../intermediaries/_oem-quotes-users/oem-quotes-users.entity';
import { PDFExporterService } from '../../../shared/pdf-exporter/pdf-exporter.service';
import { ExportType } from '../../../shared/pdf-exporter/types';
import { PdfData } from '../../../shared/pdf-exporter/types';
import { getQuotePdfData } from '../../../shared/pdf-exporter/mock-quote-data';
import { QueuesService } from '../../../shared/queues/queues.service';
import { OemCompanyEntity } from '../oem-companies/oem-company.entity';
import { OemVendosQuotes } from '../../intermediaries/_oem-vendos-quotes/oem-vendos-quotes.entity';
import { FixUpdateReplaceOne } from '../../../common/decorators/fix-replace-one.decorator';
import { SetCloneMethod } from '../../../common/decorators/set-clone-method.decorator';
import { OemQuoteCreateDto } from './oem-quote.dto/oem-quote.create.dto';
import { OemQuoteAndVendoUuid } from '../../intermediaries/_oem-quote-and-vendo-uuids/oem-quote-and-vendo-uuid.entity';
import { QuotePinCodeDto } from './oem-quote.dto/oem-quote.pin-code.dto';
import { SetDeleteMethod } from '../../../common/decorators/set-delete-method.decorator';
import { EventDispatcher } from '../../../common/decorators/event-dispatcher.decorator';
// import { OemQuoteEventsEnum } from './oem-quote.events/oem-quote.events.enum';

// ----------------------------------------------------------------
// Salesforce changes
// ----------------------------------------------------------------

import { OemCustomersService } from '../oem-customers/oem-customers.service';
import { OemCustomerEntity } from '../oem-customers/oem-customer.entity';
import { OemQuotesProducts } from '../../../oem/intermediaries/_oem-quotes-products/oem-quotes-products.entity';
import { EventsEnum } from '../../../shared/event-handler/event.enum/events.enum';
import { ISalesforceMetaData } from '../../../shared/salesforce/salesforce.types/salesforce.sf_metadata.type';
import { QuoteSalesforceUpdateDto } from '../../../shared/salesforce/salesforce.dto/quote.update.dto';

@Injectable()
@SetCurrentTenant
@FixUpdateReplaceOne
@SetCloneMethod([
  'QuoteCompanyChannel',
  'QuotesContacts',
  'QuotesCustomerProducts',
  'QuotesMaterials',
  'QuotesProducts',
  'QuotesUsers',
])
@SetDeleteMethod
export class OemQuotesService extends TypeOrmCrudService<OemQuoteEntity> {
  constructor(
    private connection: Connection,
    @InjectRepository(OemQuotesUsers)
    public usersQuotesRepo: Repository<OemQuotesUsers>,
    @InjectRepository(OemQuoteEntity)
    public repo: Repository<OemQuoteEntity>,
    @InjectRepository(OemQuotesProducts)
    public repoQuoteProduct: Repository<OemQuotesProducts>,
    @Inject(PdfMergerService)
    private readonly pdfMerger: PdfMergerService,
    @Inject(UploaderService)
    private readonly uploader: UploaderService,
    @Inject(OemCustomersService)
    private readonly customerService: OemCustomersService,
    @Inject('BUCKET_NAME')
    private readonly bucketName: string,
    @Inject(FilenameService)
    private readonly filenameGenerator: FilenameService,
    private quoteApprovalQueuesService: OemQuoteApprovalQueuesService,
    @InjectRepository(OemRecentlyViewedQuotesVendos)
    private readonly usersViewedQuotes: Repository<OemRecentlyViewedQuotesVendos>,
    private quoteAndVendoUuidsService: OemQuoteAndVendoUuidsService,
    private pdfExporter: PDFExporterService,
    private queuesService: QueuesService,
  ) {
    super(repo);
    // this.exportTestPdf();
  }

  private async _markQuoteAsViewed(user: any, quoteId: number) {
    const { userId, companyId } = user;
    const recentlyViewedQuote = await this.usersViewedQuotes.findOne({
      where: {
        userId,
        companyId,
        quoteId,
      },
    });

    if (recentlyViewedQuote) {
      await this.usersViewedQuotes.save(
        this.usersViewedQuotes.create({
          ...recentlyViewedQuote,
          updatedAt: new Date(),
        }),
      );
    } else {
      await this.usersViewedQuotes.save(
        this.usersViewedQuotes.create({
          userId,
          companyId,
          quoteId,
        }),
      );
    }
  }

  private async _updateQuoteUUID(dto): Promise<OemQuoteAndVendoUuid> {
    return this.quoteAndVendoUuidsService.updateUuid(UuidTypesEnum.QUOTE, dto);
  }

  // Used in the Salesforce quote service
  public async _createOne(
    req: CrudRequest & { user: OemUserEntity },
    dto: Partial<OemQuoteCreateDto>,
  ) {
    const uuid = await this._updateQuoteUUID(dto);

    dto.quoteUuid = uuid.prefix + uuid.lastUuid;

    const defaultQuoteExpiration = req.user?.company?.defaultQuoteExpiration;
    const expiresAt =
      (defaultQuoteExpiration &&
        moment.utc().add(defaultQuoteExpiration, 'days').toDate()) ||
      moment.utc().add(3, 'months').toDate();

    dto.expiresAt = dto.expiresAt || expiresAt;

    if (!dto.ownerUserId) {
      dto.ownerUserId = req.user.userId;
    }

    if (dto.sfMetaData) {
      const customer = await this.parseMetaDataSF(req, dto);

      dto.customerId = customer.customerId;
      // dto.ownerUserId = req['user'].user_id;
    }

    return super.createOne.call(this, req, dto);
  }

  @ActionLogs(ActionLogTypeEnum.QUOTE, ActionsEnum.CREATE)
  async createOne(
    req: CrudRequest & { user: OemUserEntity },
    dto: Partial<OemQuoteCreateDto>,
  ): Promise<OemQuoteEntity> {
    const quote = await this._createOne(req, dto);

    if (dto.sfMetaData) this.createDefaultQuoteUserSF(dto, quote);

    return quote;
  }

  //TODO: pinCode should be moved to external approval queue, but we are going to refactor approval-queue module, so we just leaving it here
  async verifyPinCode(
    req: CrudRequest,
    dto: QuotePinCodeDto,
  ): Promise<boolean> {
    const quote = await super.getOne(req);
    return quote.checkPinCode(dto.pinCode);
  }

  //TODO: TODO it should be moved to integrated salesforce service
  @EventDispatcher<OemQuoteEntity>(EventsEnum.QUOTE_TRANSACTED)
  async updateFromSalesforce(
    req: CrudRequest,
    dto: QuoteSalesforceUpdateDto,
  ): Promise<OemQuoteEntity> {
    return this.repo.manager.connection.transaction(async (manager) => {
      const quoteId = req.parsed.paramsFilter.find(
        (params) => params.field === req.options.params.id.field,
      );

      const quote = await this.repo.findOne(quoteId.value);

      if (quote.quoteStatus !== QuoteStatusEnum.TRANSACTED)
        throw new BadRequestException('Invalid Quote: Quote is not transacted');

      return await this.update(quoteId.value, dto, manager);
    });
  }

  async getOne(
    req: CrudRequest,
  ): Promise<Extract<OemQuoteEntity, { isApprovalTurn: boolean }>> {
    return this.repo.manager.transaction(
      async (
        manager,
      ): Promise<Extract<OemQuoteEntity, { isApprovalTurn: boolean }>> => {
        let dynamicResponse = { isApprovalTurn: false };
        const quote: OemQuoteEntity = await super.getOne(req);
        const user = req['user'];

        try {
          const quoteApprovalQueue =
            await this.quoteApprovalQueuesService.repo.findOne({
              userId: user.userId,
              quoteId: quote.quoteId,
              isActive: true,
            });

          const validatedQuoteApprovalQueue =
            quoteApprovalQueue &&
            (await this.quoteApprovalQueuesService.validate(
              req,
              quoteApprovalQueue.quoteApprovalQueueId,
              {},
              manager,
            ));

          if (validatedQuoteApprovalQueue) {
            dynamicResponse = { isApprovalTurn: true };
          }
        } catch (error) {
          console.error('Get One Quote - Dynamic isApprovalTurn Field', error);
        }

        await this._markQuoteAsViewed(req['user'], quote.quoteId);
        return { ...quote, ...dynamicResponse } as Extract<
          OemQuoteEntity,
          { isApprovalTurn: boolean }
        >;
      },
    );
  }

  // async getMany(req: CrudRequest): Promise<OemQuoteEntity[]> {
  //   return (await super.getMany(req)) as OemQuoteEntity[];
  // }

  async exportTestPdf(): Promise<any> {
    console.log('Generate test "Exported Quote.pdf"');
    const pdfBuffer = await this.pdfExporter.generatePDF(
      ExportType.Quote,
      getQuotePdfData(),
    );

    fs.writeFile('./Exported Quote.pdf', pdfBuffer, (err) => {
      if (err) return console.error(err);
    });

    return true;
  }

  /**
   * update 3.10.12
   * it should be private
   */
  private async generatePdf(quote: OemQuoteEntity) {
    for (const [propertyName, value] of Object.entries(
      quote.quoteCommentSettings,
    )) {
      quote.quoteComments = quote.quoteComments + '\n' + value;
    }
    const quoteData: PdfData = {
      quotes: [quote],
      company: quote.company,
      companyAddress: quote.company.companyAddress.address,
    };

    const pdfBuffer = await this.pdfExporter.generatePDF(
      ExportType.Quote,
      quoteData,
    );

    return pdfBuffer;
  }

  // For some reason this function is treated as promise, not sure why
  private static _getPdfFileName(quote: OemQuoteEntity) {
    const { pdfFileUrl } = quote;
    if (!pdfFileUrl) {
      return {
        oldName: null,
        newName: `${quote.quoteUuid}-1.pdf`,
      };
    }

    // https://files.vendori.com/pdf/Q-9831893828.pdf?Expires=1697858429
    const pdfFileNameMatch = pdfFileUrl.match(/Q-[0-9]+[-0-9]*\.pdf/);
    const pdfFileName = pdfFileNameMatch && pdfFileNameMatch[0];
    const currentIndex =
      Number(
        pdfFileName?.replace(`${quote.quoteUuid}-`, '').replace('.pdf', ''),
      ) || 0;

    return {
      oldName: pdfFileName,
      newName: `${quote.quoteUuid}-${currentIndex + 1}.pdf`,
    };
  }

  // When exporting it uses this.repo.manager based on the current tenant.
  // When it’s called on pdf-export-queue, it would run with the super connection which is passed from the queue.
  async exportPdf(quoteId: number, manager = this.repo.manager): Promise<any> {
    const quote = await manager
      .createQueryBuilder(OemQuoteEntity, 'quote')
      // main quote data
      .innerJoinAndSelect('quote.company', 'company')
      .innerJoinAndSelect('company.companyAddress', 'companyAddress')
      .innerJoinAndSelect('companyAddress.address', 'addressForCompany')
      .leftJoinAndSelect('quote.customer', 'customer')
      .leftJoinAndSelect('customer.customerAddresses', 'customerAddresses')
      .leftJoinAndSelect('customerAddresses.address', 'addressForCustomer')
      .leftJoinAndSelect(
        'quote.usersQuotes',
        'quoteUsers',
        'quoteUsers.isOwner = TRUE',
      )
      .leftJoinAndSelect('quoteUsers.user', 'user')
      .leftJoinAndSelect(
        'quote.quotesProducts',
        'quoteProducts',
        'quoteProducts.isEnabled = true',
      )
      .leftJoinAndSelect('quoteProducts.bundle', 'quoteBundles')
      .leftJoinAndSelect(
        'quote.quotesContacts',
        'quoteContacts',
        'quoteContacts.isEnabled = TRUE',
      )
      .leftJoinAndSelect(
        'quoteContacts.contact',
        'contact',
        'contact.isEnabled = TRUE',
      )
      // to merge
      .leftJoinAndSelect(
        'quote.quotesMaterials',
        'quoteMaterials',
        'quoteMaterials.isEnabled = TRUE',
      )
      .leftJoinAndSelect(
        'quoteMaterials.material',
        'material',
        'material.isEnabled=TRUE',
      )
      .where({ quoteId })
      .getOne();

    if (!quote) {
      throw new NotFoundException('Invalid Quote');
    }

    // check here for bundle
    quote.quotesProducts?.sort((a, b) => a.quoteProductId - b.quoteProductId);

    let pdfBuffer = await this.generatePdf(quote);

    const quoteMaterials = quote.quotesMaterials.sort(
      (quoteMaterial1, quoteMaterial2) =>
        quoteMaterial1.position - quoteMaterial2.position,
    );

    const materialsBefore = quoteMaterials
      .filter((quoteMaterial) => quoteMaterial.position < 0)
      .map((quoteMaterial) => quoteMaterial.material);

    const materialsAfter = quoteMaterials
      .filter((quoteMaterial) => quoteMaterial.position > 0)
      .map((quoteMaterial) => quoteMaterial.material);

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

    const quotePDFLength = pdfsBufffer.push(pdfBuffer);
    const quotePDFPosition = quotePDFLength - 1;

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
      pdfBuffer = await this.pdfMerger.merge(pdfsBufffer, quotePDFPosition);
    }

    // This is ridiculous, not sure why it's treated as promise. Maybe it's because functions are wrapped for multi-tenancy or something?
    const { oldName, newName } = await OemQuotesService._getPdfFileName(quote);
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

    await manager.update(OemQuoteEntity, { quoteId }, { pdfFileUrl });

    return pdfFileUrl;
  }

  //TODO: this method isn't idempotent, should be idempotent! Also I think we should refactor this one.
  /**
   * @param req
   * @param quoteId
   * @param to
   * @param externalUserIds
   * @description Method for submit quote.
   * Flow:
   * submit?Internal -> create approval queue for internal team -> approve -> submit?External -> send email for selected external users, where one of them is approver with confirmation link -> transact
   */
  @ActionLogs(ActionLogTypeEnum.QUOTE, ActionsEnum.SUBMIT)
  async submit(
    req: Partial<
      CrudRequest & {
        user: OemUserEntity;
        externalUsers?: Array<OemUserEntity>;
      }
    >,
    quoteId: number,
    to: ToTypeEnum,
    externalUserIds?: Array<number>,
  ): Promise<any> {
    return this.repo.manager.transaction(async (manager) => {
      const quote = await this.repo.findOne({
        quoteId: quoteId,
      });

      if (!quote) throw new NotFoundException('Quote not found');

      // We are nullifying quoteName on clone, so need to validate on submit
      if (!quote.quoteName) {
        throw new BadRequestException('Quote name should not be empty');
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
        //to !== ToTypeEnum.INTERNAL &&  //due of pdfExportQueue we disable it
        !quote.customerId ||
        !quote.opportunityId
      ) {
        throw new BadRequestException('Customer information is missing');
      }

      let externalUsers = [];
      if (externalUserIds && externalUserIds.length > 0)
        externalUsers = (
          await this.usersQuotesRepo.find({
            where: {
              quoteId: quoteId,
              userId: In(externalUserIds),
            },
            relations: ['user'],
          })
        ).map((quoteUser) => quoteUser.user);

      if (to === ToTypeEnum.EXTERNAL || to === ToTypeEnum.CUSTOMER) {
        quote.generatePinCode();
      }

      // permutations
      // ┌─────┬────────────────────────────┬──────────┬─────────────────────────────┬────────────────────────────┬────────────────┐
      // │  #  │      Original Status       │    to    │        Updated Status       │           Email            │      Note      │
      // ├─────┼────────────────────────────┼──────────┼─────────────────────────────┼────────────────────────────┼────────────────┤
      // │  1  │       Not Transacted       │ Internal │           Pending           │  Approval emails to users  │  resubmission  │
      // ├─────┼────────────────────────────┼──────────┼─────────────────────────────┼────────────────────────────┼────────────────┤
      // │  2  │        Auto-Approved       │ External │ Pending Customer Acceptance │ Approval email to customer │                │
      // ├─────┼────────────────────────────┼──────────┼─────────────────────────────┼────────────────────────────┼────────────────┤
      // │  3  │          Approved          │ External │ Pending Customer Acceptance │ Approval email to customer │                │
      // ├─────┼────────────────────────────┼──────────┼─────────────────────────────┼────────────────────────────┼────────────────┤
      // │  4  │         Transacted         │ Customer │              -              │  Transacted emails to all  │                │
      // └─────┴────────────────────────────┴──────────┴─────────────────────────────┴────────────────────────────┴────────────────┘

      const originalStatus = quote.quoteStatus;
      const isPending =
        originalStatus !== QuoteStatusEnum.TRANSACTED &&
        to === ToTypeEnum.INTERNAL;
      const isAutoApproved =
        originalStatus === QuoteStatusEnum.AUTO_APPROVED &&
        to === ToTypeEnum.EXTERNAL;
      const isApproved =
        originalStatus === QuoteStatusEnum.APPROVED &&
        to === ToTypeEnum.EXTERNAL;
      const isPendingCustomerAcceptance =
        originalStatus === QuoteStatusEnum.SENT_EXTERNALLY &&
        to === ToTypeEnum.EXTERNAL;
      const isTransacted =
        originalStatus === QuoteStatusEnum.TRANSACTED &&
        to === ToTypeEnum.CUSTOMER;

      if (isPending) {
        quote.quoteStatus = QuoteStatusEnum.PENDING_INTERNAL_APPROVAL;
        quote.isLocked = false;
        quote.submittedAt = new Date();
      } else if (isAutoApproved || isApproved) {
        quote.quoteStatus = QuoteStatusEnum.SENT_EXTERNALLY;
        quote.isLocked = isApproved ? true : quote.isLocked;
        quote.submittedAt = new Date();
      } else if (!isPendingCustomerAcceptance && !isTransacted) {
        throw new BadRequestException(
          "Invalid submission: status must not be 'pending customer acceptance' or 'transacted'",
        );
      }

      await manager.save(quote);
      req.externalUsers = externalUsers;

      if (isPending) {
        this.queuesService.addPdfExportQueue({ quoteId });
      }

      await this.quoteApprovalQueuesService.quoteResubmitHandler(
        req,
        quote,
        manager,
      );

      return quote;
    });
  }

  private async _backToDraft(quoteId: number, manager: EntityManager) {
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
            quoteId,
            isLocked: true,
          },
          {
            isLocked: false,
          },
        );
      }
    }

    await this.quoteApprovalQueuesService.deactivateQuoteApprovalQueues(
      quoteId,
      manager,
    );
  }

  async update(
    quoteId: number,
    dto: Partial<OemQuoteUpdateDto>,
    manager: EntityManager,
  ) {
    const quote = await this.repo.findOne(quoteId);
    if (!quote) throw new NotFoundException('Quote not found');

    let { isLocked } = quote;
    const isBackToDraft =
      quote.quoteStatus !== dto.quoteStatus &&
      dto.quoteStatus === QuoteStatusEnum.DRAFT;

    if (isBackToDraft) {
      isLocked = false;
      await this._backToDraft(quoteId, manager);
    }

    const updatedQuote = await manager.save(
      this.repo.create({
        ...quote,
        ...dto,
        submittedAt: new Date(),
        isLocked,
      }),
    );

    return updatedQuote;
  }

  @EventDispatcher<OemQuoteEntity>(EventsEnum.QUOTE_CHANGED)
  @ActionLogs(ActionLogTypeEnum.QUOTE, ActionsEnum.UPDATE)
  async updateOne(
    req: CrudRequest,
    dto: Partial<OemQuoteUpdateDto>,
  ): Promise<OemQuoteEntity> {
    return this.repo.manager.connection.transaction(async (manager) => {
      const quoteId = req.parsed.paramsFilter.find(
        (params) => params.field === req.options.params.id.field,
      );

      const quote = await this.repo.findOne(quoteId.value);

      // TODO: move to the salesforce-integration endpoint
      await this.resetOtherQuotePrimariesSF(dto, quote);
      await this.updateQuoteOwnerSF(dto, quote);

      return await this.update(quoteId.value, dto, manager);
    });
  }

  @EventDispatcher<OemQuoteEntity>(EventsEnum.QUOTE_CHANGED)
  @ActionLogs(ActionLogTypeEnum.QUOTE, ActionsEnum.UPDATE)
  async replaceOne(
    req: CrudRequest & { user: OemUserEntity },
    dto: Partial<OemQuoteReplaceDto>,
  ): Promise<OemQuoteEntity> {
    return this.connection.transaction(async (manager) => {
      const quoteId = req.parsed.paramsFilter.find(
        (params) => params.field === req.options.params.id.field,
      );

      const quote = await this.repo.findOne(quoteId.value);

      // Why no async?
      // TODO: move to the salesforce-integration endpoint
      await this.resetOtherQuotePrimariesSF(dto, quote);
      await this.updateQuoteOwnerSF(dto, quote);

      if (!quote.geoHierarchyId) quote.geoHierarchyId = req.user.geoHierarchyId;

      if (quote) return await this.update(quoteId.value, dto, manager);

      return await super.replaceOne(req, dto);
    });
  }

  @ActionLogs(ActionLogTypeEnum.QUOTE, ActionsEnum.DELETE)
  async deleteOne(req: CrudRequest) {
    const quoteId = req.parsed.paramsFilter.find(
      (params) => params.field === req.options.params.id.field,
    )?.value;
    const quote = quoteId && (await this.repo.findOne(quoteId));
    if (!quote) {
      throw new NotFoundException('Quote not found');
    }

    const vendoQuote = await this.repo.manager.findOne(OemVendosQuotes, {
      where: {
        quoteId,
      },
    });
    if (vendoQuote) {
      throw new BadRequestException('This quote is attached to other vendos');
    }

    const relationsToExclude = ['VendosQuotes'];
    return this.repo.manager.transaction(async (manager) => {
      const deactivatedQuote = await manager.save(
        this.repo.create({
          ...quote,
          isEnabled: false,
        }),
      );

      const relations = this.repo.metadata.ownRelations
        .map((relation) => relation.inverseEntityMetadata)
        .filter(
          (relation) =>
            Object.keys(relation.propertiesMap).includes('quoteId') &&
            Object.keys(relation.propertiesMap).includes('isEnabled') &&
            !relationsToExclude.includes(relation.targetName),
        );
      for (const relation of relations) {
        const entities = await manager.find(relation.targetName, {
          quoteId,
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

      return deactivatedQuote;
    });
  }

  async getClonedData(originalQuote: OemQuoteEntity, manager: EntityManager) {
    const quoteAndVendoUuid = await this.quoteAndVendoUuidsService.updateUuid(
      UuidTypesEnum.QUOTE,
      {
        companyId: originalQuote.companyId,
      },
    );

    const company = await manager.findOne(
      OemCompanyEntity,
      originalQuote.companyId,
    );
    const expiresAt =
      (company?.defaultQuoteExpiration &&
        moment.utc().add(company.defaultQuoteExpiration, 'days').toDate()) ||
      moment.utc().add(3, 'months').toDate();

    return {
      ..._.omit(originalQuote, [
        'quoteId',
        'quoteStatus',
        'createdAt',
        'updatedAt',
      ]),
      quoteUuid: quoteAndVendoUuid.uuid,
      isLocked: false,
      expiresAt,
      quoteName:
        originalQuote.quoteName + ' - Cloned from ' + originalQuote.quoteUuid,
    };
  }

  // ----------------------------------------------------------------
  // Salesforce Changes
  // ----------------------------------------------------------------

  // TODO: move to the salesforce-integration endpoint

  async createDefaultQuoteUserSF(
    dto: Partial<OemQuoteCreateDto>,
    quote: Partial<OemQuoteEntity>,
  ) {
    return this.usersQuotesRepo.create({
      userId: dto.ownerUserId,
      quoteId: quote.quoteId,
      isOwner: true,
    });
  }

  async parseMetaDataSF(
    req: any,
    dto: Partial<OemQuoteCreateDto>,
  ): Promise<Partial<OemCustomerEntity>> {
    return await this.customerService.integrateCustomerSalesforce(
      req,
      { idOpportunity: dto.opportunityId },
      dto.sfMetaData as unknown as ISalesforceMetaData,
    );
  }

  async resetOtherQuotePrimariesSF(
    dto: Partial<OemQuoteReplaceDto> | Partial<OemQuoteUpdateDto>,
    quote: OemQuoteEntity,
  ) {
    if (dto.isPrimary) {
      const quotesNoLongerPrimary = await this.repo.find({
        isPrimary: true,
        opportunityId: quote.opportunityId,
      });

      for (const q of quotesNoLongerPrimary)
        await this.repo.update(q.quoteId, { isPrimary: false });
      const quoteProducts = await this.repoQuoteProduct.find({
        quoteId: quote.quoteId,
      });
      // If we change primary quote, need to remove current opportunity product ids in oem-quote-product
      for (const p of quoteProducts)
        await this.repoQuoteProduct.update(p.quoteProductId, {
          sfOpportunityProductId: null,
        });
    }
  }

  // TODO: move to the salesforce-integration endpoint
  async updateQuoteOwnerSF(
    dto: Partial<OemQuoteReplaceDto> | Partial<OemQuoteUpdateDto>,
    quote: OemQuoteEntity,
  ) {
    if (dto.ownerUserId) {
      const quoteUsers = await this.usersQuotesRepo.find({
        quoteId: quote.quoteId,
      });

      for (const u of quoteUsers)
        this.usersQuotesRepo.update(
          { userId: u.userId, quoteId: quote.quoteId },
          { isOwner: false },
        );

      this.usersQuotesRepo.update(
        { userId: dto.ownerUserId, quoteId: quote.quoteId },
        { isOwner: true },
      );
    }
  }
}
