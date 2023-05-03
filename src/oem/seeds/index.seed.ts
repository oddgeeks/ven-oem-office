import { Factory, runSeeder, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import CreateOemCompanies from './create-oem-companies.seed';
import CreateOemAddresses from './create-oem-addresses.seed';
import CreateOemRoles from './create-oem-roles.seed';
import CreateOemUsers from './create-oem-users.seed';
import CreateOemQuotes from './create-oem-quotes.seed';
import CreateOemVendos from './create-oem-vendos.seed';
import CreateOemCustomer from './create-oem-customer.seed';
import CreateOemShadingRulesSeed from './create-oem-shading-rules.seed';
import CreateOemLicensingPrograms from './create-oem-licensing-programs.seed';
import CreateOemHierarchyLevels from './create-oem-hierarchy-levels.seed';
import CreateOemHierarchies from './create-oem-hierarchies.seed';
import CreateOemQuoteCompanyChannels from './create-oem-quote-company-channels.seed';
import CreateOemProducts from './create-oem-products.seed';
import CreateOemPriceTiers from './create-oem-price-tiers.seed';
import CreateOemPricingModels from './create-oem-pricing-models.seed';
import CreateOemMaterials from './create-oem-materials.seed';
import CreateOemQuotesProducts from './create-oem-quotes-products.seed';
import CreateOemQuotesMaterials from './create-oem-quotes-materials.seed';
import CreateOemCustomersProducts from './create-oem-customers-products.seed';
import CreateOemUnitTiers from './create-oem-unit-tiers.seed';
import CreateOemProductsRelationships from './create-oem-products-relationships.seed';
import CreateOemContacts from './create-oem-contacts.seed';
import CreateOemVisibleProductFields from './create-oem-visible-product-fields.seed';
import CreateOemDiscountRules from './create-oem-discount-rules.seed';
import CreateOemApprovalQueuePriorities from './create-oem-approval-queue-priorities.seed';
import CreateOemDiscounts from './create-oem-discounts.seed';
import CreateOemCompanyAddresses from './create-oem-company-addresses.seed';
import CreateOemChannels from './create-oem-channels.seed';
import CreateOemCompanyPrograms from './create-oem-company-programs.seed';
import CreateOemWorkflowRules from './create-oem-workflow-rules.seed';
import CreateOemCustomerAddresses from './create-oem-customer-addresses.seed';
import CreateOemCompanyChannelSettings from './create-oem-company-channel-settings.seed';
import CreateOemCompanyChannels from './create-oem-company-channels.seed';
import CreateDemoOemHierarchyLevels from './demo/create-demo-oem-hierarchy-levels.seed';
import CreateDemoOemHierarchies from './demo/create-demo-oem-hierarchies.seed';

/**
 * Need to save an order, bc downstream relations depend with above.
 */

//TODO: need to add validation for seed order
export default class IndexSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await runSeeder(CreateOemCompanies);
    const channels = await runSeeder(CreateOemChannels);
    await runSeeder(CreateOemCustomer);

    await runSeeder(CreateOemAddresses);
    await runSeeder(CreateOemCompanyAddresses);
    await runSeeder(CreateOemCustomerAddresses);

    await runSeeder(CreateOemRoles());
    await runSeeder(CreateDemoOemHierarchyLevels({companyId: 1}));
    await runSeeder(CreateDemoOemHierarchies({companyId: 1}));

    await runSeeder(CreateOemUsers);

    await runSeeder(CreateOemCompanyPrograms);
    await runSeeder(CreateOemLicensingPrograms);
    //await runSeeder(CreateOemCompanyChannelSettings(channels));
    //await runSeeder(CreateOemCompanyChannels);
    await runSeeder(CreateOemVisibleProductFields);

    // await runSeeder(CreateOemQuotes);
    // await runSeeder(CreateOemQuoteCompanyChannels);
    // await runSeeder(CreateOemVendos);
    // await runSeeder(CreateOemMaterials);
    // await runSeeder(CreateOemShadingRulesSeed);
    // await runSeeder(CreateOemPricingModels);
    // await runSeeder(CreateOemUnitTiers);
    // await runSeeder(CreateOemProducts);
    // await runSeeder(CreateOemProductsRelationships);
    // await runSeeder(CreateOemPriceTiers);
    // await runSeeder(CreateOemCustomersProducts);
    // await runSeeder(CreateOemQuotesProducts);
    // await runSeeder(CreateOemQuotesMaterials);
    // await runSeeder(CreateOemContacts);
    // await runSeeder(CreateOemDiscountRules);
    // await runSeeder(CreateOemDiscounts);

    await runSeeder(CreateOemApprovalQueuePriorities);
    await runSeeder(CreateOemWorkflowRules);
  }
}
