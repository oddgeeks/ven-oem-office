import {
  Module,
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  RequestMethod,
  NestModule,
} from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_INTERCEPTOR } from '@nestjs/core';
// import { NewrelicModule, NewrelicInterceptor } from '@pmc12thsuki/newrelic';

import { SalesforceModule } from './shared/salesforce/salesforce.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './shared/s3-upload/upload.module';

import { OemAddressesModule } from './oem/main/oem-addresses/oem-addresses.module';
import { OemCompaniesModule } from './oem/main/oem-companies/oem-companies.module';
import { OemContactsModule } from './oem/main/oem-contacts/oem-contacts.module';
import { OemUsersModule } from './oem/main/oem-users/oem-users.module';
import { OemRolesModule } from './oem/main/oem-roles/oem-roles.module';
import { OemVendosModule } from './oem/main/oem-vendos/oem-vendos.module';
import { OemQuotesModule } from './oem/main/oem-quotes/oem-quotes.module';
import { OemCustomersModule } from './oem/main/oem-customers/oem-customers.module';
import { OemProductsModule } from './oem/main/oem-products/oem-products.module';
import { OemMaterialsModule } from './oem/main/oem-materials/oem-materials.module';
import { OemShadingRulesModule } from './oem/main/oem-shading-rules/oem-shading-rules.module';
import { OemHierarchiesModule } from './oem/main/oem-hierarchies/oem-hierarchies.module';
import { OemHierarchyLevelsModule } from './oem/main/oem-hierarchy-levels/oem-hierarchy-levels.module';
import { OemLicensingProgramsModule } from './oem/main/oem-licensing-programs/oem-licensing-programs.module';
import { OemQuoteCompanyChannelsModule } from './oem/intermediaries/_oem-quote-company-channels/oem-quote-company-channels.module';

import { OemCompanyAddressesModule } from './oem/intermediaries/_oem-company-addresses/oem-company-addresses.module';
import { OemQuotesContactsModule } from './oem/intermediaries/_oem-quotes-contacts/oem-quotes-contacts.module';
import { OemQuotesCustomerProductsModule } from './oem/intermediaries/_oem-quotes-customer-products/oem-quotes-customer-products.module';
import { OemQuotesUsersModule } from './oem/intermediaries/_oem-quotes-users/oem-quotes-users.module';
import { OemVendosContactsModule } from './oem/intermediaries/_oem-vendos-contacts/oem-vendos-contacts.module';
import { OemVendosQuotesModule } from './oem/intermediaries/_oem-vendos-quotes/oem-vendos-quotes.module';
import { OemVendosUsersModule } from './oem/intermediaries/_oem-vendos-users/oem-vendos-users.module';
import { OemQuotesMaterialsModule } from './oem/intermediaries/_oem-quotes-materials/oem-quotes-materials.module';
import { OemVendosMaterialsModule } from './oem/intermediaries/_oem-vendos-materials/oem-vendos-materials.module';
import { OemCustomersProductsModule } from './oem/intermediaries/_oem-customers-products/oem-customers-products.module';
import { OemProductsRelationshipsModule } from './oem/intermediaries/_oem-products-relationships/oem-products-relationships.module';
import { OemPricingModelsModule } from './oem/main/oem-pricing-models/oem-pricing-modes.module';
import { OemPriceTiersModule } from './oem/main/oem-price-tiers/oem-price-tiers.module';
import { PdfMergerModule } from './shared/pdf-merger/pdf-merger.module';
import { OemWorkflowRulesModule } from './oem/main/oem-workflow-rules/oem-workflow-rules.module';
import { OemUnitTiersModule } from './oem/main/oem-unit-tiers/oem-unit-tiers.module';
import { OemQuotesProductsModule } from './oem/intermediaries/_oem-quotes-products/oem-quotes-products.module';
import { OemDiscountsModule } from './oem/main/oem-discounts/oem-discounts.module';
import { OemVisibleProductFieldsModule } from './oem/main/oem-visible-product-fields/oem-visible-product-fields.module';
import { OemDiscountRulesModule } from './oem/main/oem-discount-rules/oem-discount-rules.module';
import { OemRolesVisibleProductFieldsModule } from './oem/intermediaries/_oem-roles-visible-product-fields/oem-roles-visible-product-fields.module';
import { OemVacationRulesModule } from './oem/main/oem-vacation-rules/oem-vacation-rules.module';
import { OemNotificationsModule } from './oem/main/oem-notifications/oem-notifications.module';
import { OemApprovalQeuePrioritiesModule } from './oem/main/oem-approval-queue-priorities/oem-approval-queue-priorities.module';
import { OemDiscountPrioritiesModule } from './oem/intermediaries/_oem-discount-priorities/oem-discount-priorities.module';
import { OemDiscountRulesDiscountsModule } from './oem/intermediaries/_oem-discount-rules-discounts/oem-discount-rules-discounts.module';
import { OemQuoteApprovalQueuesModule } from './oem/intermediaries/_oem-approval-queues/_oem-quote-approval-queues/oem-quote-approval-queues.module';
import { OemVendoApprovalQueuesModule } from './oem/intermediaries/_oem-approval-queues/_oem-vendo-approval-queues/oem-vendo-approval-queues.module';
import { OemRecentlyViewedQuotesVendosModule } from './oem/intermediaries/_oem-recently-viewed-quotes-vendos/oem-recently-viewed-quotes-vendos.module';
import { OemQuotesAndVendosModule } from './oem/intermediaries/_oem-quotes-and-vendos/oem-quotes-and-vendos.module';
import { QueuesModule } from './shared/queues/queues.module';
import { OemActionLogsModule } from './oem/main/oem-action-logs/oem-action-logs.module';
import { OemNotificationPreferencesModule } from './oem/main/oem-notification-preferences/oem-notification-preferences.module';
import { OemSavedAlertRulesModule } from './oem/main/oem-saved-alert-rules/oem-saved-alert-rules.module';
import { OemQuoteAndVendoUuidsModule } from './oem/intermediaries/_oem-quote-and-vendo-uuids/oem-quote-and-vendo-uuids.module';
import { TenantMiddleware } from './common/middlewares/tenant.middleware';
import { TenantsModule } from './shared/tenants/tenants.module';
import { OemStatsModule } from './oem/main/oem-stats/oem-stats.module';
import { OemChannelsModule } from './oem/main/oem-channels/oem-channels.module';
import { OemCompanyProgramsModule } from './oem/intermediaries/_oem-company-programs/oem-company-programs.module';
import { OemCompanyChannelsModule } from './oem/intermediaries/_oem-company-channels/oem-company-channels.module';
import { ACLModule } from './auth/roles/acl.module';
import { OemSettingsModule } from './oem/main/oem-settings/oem-settings.module';
import { PdfExporterModule } from './shared/pdf-exporter/pdf-exporter.module';
import { OemSupportsModule } from './oem/main/oem-supports/oem-supports.module';
import { ConnectionMiddleware } from './common/middlewares/connection.middleware';
import { OemCustomerAddressesModule } from './oem/intermediaries/_oem-customer-addresses/oem-customer-addresses.module';
import { OemSalesforceModule } from './oem/main/oem-salesforce/oem-salesforce.module';
import { OemExternalUsersModule } from './oem/main/oem-external-users/oem-external-users.module';
import { OemQuotesExternalUsersModule } from './oem/intermediaries/_oem-quotes-external-users/oem-quotes-external-users.module';
import { OemCompanyChannelSettingsModule } from './oem/intermediaries/_oem-company-channels-settings/oem-company-channel-settings.module';
import { OemSalesforceIntegrationsModule } from './oem/main/oem-integrations/oem-salesforce-integrations/oem-salesforce-integrations.module';
import { OemBundlesModule } from './oem/main/oem-bundles/oem-bundles.module';
import { EventHandlerModule } from './shared/event-handler/event-handler.module';
import { OemCompanyChannelAddressesModule } from './oem/intermediaries/_oem-company-channel-addresses/oem-company-channel-addresses.module';

const imports = [
  EventEmitterModule.forRoot(),
  TenantsModule,
  AuthModule,
  ACLModule,
  UploadModule,
  OemQuotesModule,
  SalesforceModule,
  PdfMergerModule,
  OemCompaniesModule,
  OemAddressesModule,
  OemUsersModule,
  OemExternalUsersModule,
  OemRolesModule,

  OemVendosModule,
  OemCustomersModule,
  OemMaterialsModule,
  OemContactsModule,
  OemProductsModule,
  OemShadingRulesModule,
  OemCompanyAddressesModule,
  OemQuotesContactsModule,
  OemQuotesCustomerProductsModule,
  OemQuotesProductsModule,
  OemQuotesUsersModule,
  OemVendosContactsModule,
  OemVendosQuotesModule,
  OemVendosUsersModule,
  OemQuotesMaterialsModule,
  OemVendosMaterialsModule,
  OemCustomersProductsModule,
  OemProductsRelationshipsModule,
  OemHierarchiesModule,
  OemHierarchyLevelsModule,
  OemLicensingProgramsModule,
  OemQuoteCompanyChannelsModule,
  OemPriceTiersModule,
  OemPricingModelsModule,
  OemDiscountRulesModule,
  OemRolesVisibleProductFieldsModule,
  OemVacationRulesModule,
  OemNotificationsModule,
  OemApprovalQeuePrioritiesModule,
  OemDiscountPrioritiesModule,
  OemDiscountRulesDiscountsModule,
  OemRecentlyViewedQuotesVendosModule,
  OemQuotesAndVendosModule,
  OemWorkflowRulesModule,
  OemUnitTiersModule,
  OemDiscountsModule,
  OemVisibleProductFieldsModule,
  OemActionLogsModule,
  OemNotificationPreferencesModule,
  OemSavedAlertRulesModule,
  OemQuoteAndVendoUuidsModule,
  OemStatsModule,
  OemChannelsModule,
  OemCompanyProgramsModule,
  OemCompanyChannelsModule,
  OemSettingsModule,
  OemSupportsModule,
  PdfExporterModule,
  OemCustomerAddressesModule,
  OemCompanyChannelAddressesModule,
  QueuesModule,
  OemQuoteApprovalQueuesModule,
  OemVendoApprovalQueuesModule,
  OemSalesforceModule,
  OemQuotesExternalUsersModule,
  OemCompanyChannelSettingsModule,
  OemSalesforceIntegrationsModule,
  // OemProductsBundlesModule,
  OemBundlesModule,
  EventHandlerModule,
];

//Todo we need custom ClassSerializer for nested object which we get from joins in CRUDTypeorm
//https://stackoverflow.com/questions/72836741/serialize-nested-objects-using-class-transformer-nest-js
const providers: any[] = [
  {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor,
  },
];

/*if (process.env.ENABLE_QUEUES == 'TRUE') {
  imports.push();
  imports.push();
  imports.push();
}*/

// if (process.env.NEW_RELIC_LICENSE_KEY) {
//   imports.push(NewrelicModule.register({ global: true }));
//   providers.push({
//     provide: APP_INTERCEPTOR,
//     useClass: NewrelicInterceptor,
//   });
// }

// console.log(
//   'process.env.NEW_RELIC_LICENSE_KEY',
//   process.env.NEW_RELIC_LICENSE_KEY,
// );

@Module({
  imports,
  controllers: [],
  providers,
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(TenantMiddleware)
      .exclude({
        path: '/sessions/authorization-code/callback',
        method: RequestMethod.ALL,
      })
      .forRoutes({ path: '*', method: RequestMethod.ALL })
      .apply(ConnectionMiddleware)
      .exclude({
        path: '/sessions/authorization-code/callback',
        method: RequestMethod.ALL,
      })
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
