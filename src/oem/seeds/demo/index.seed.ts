import { Factory, runSeeder, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { OemHierarchyEntity } from '../../main/oem-hierarchies/oem-hierarchy.entity';
import CreateDemoOemHierarchyLevels from './create-demo-oem-hierarchy-levels.seed';
import CreateDemoOemHierarchies from './create-demo-oem-hierarchies.seed';
import CreateDemoOemCompanies from './create-demo-oem-companies.seed';
import CreateDemoOemChannels from './create-demo-oem-channels.seed';
import CreateDemoOemCompanyPrograms from './create-demo-oem-company-programs.seed';
import CreateDemoOemLicensingPrograms from './create-demo-oem-licensing-programs.seed';
import CreateDemoOemCompanyChannelSettings from './create-demo-oem-company-channel-settings.seed';
import CreateDemoOemCompanyChannels from './create-demo-oem-company-channels.seed';
import CreateDemoOemRoles from './create-demo-oem-roles.seed';
import CreateDemoOemUsers from './create-demo-oem-users.seed';
import CreateDemoOemAddresses from './create-demo-oem-addresses.seed';
import CreateDemoOemCompanyAddresses from './create-demo-oem-company-addresses.seed';
import CreateDemoOemWorkflowRules from './create-demo-oem-workflow-rules.seed';
import CreateDemoOemVisibleProductFields from './create-demo-oem-visible-product-fields.seed';
import CreateDemoOemMaterials from './create-demo-oem-materials.seed';
import CreateDemoOemDiscountRules from './create-demo-oem-discount-rules.seed';
import CreateDemoOemDiscounts from './create-demo-oem-discounts.seed';
import CreateDemoOemPricingModels from './create-demo-oem-pricing-models.seed';
import CreateDemoOemUnitTiers from './create-demo-oem-unit-tiers.seed';
import CreateDemoOemProducts from './create-demo-oem-products.seed';
import CreateDemoOemPriceTiers from './create-demo-oem-price-tiers.seed';
import CreateDemoOemShadingRulesSeed from './create-demo-oem-shading-rules.seed';
import CreateDemoOemCustomers from './create-demo-oem-customers.seed';
import CreateDemoOemCustomerAddresses from './create-demo-oem-customer-addresses.seed';
import CreateDemoOemCustomerProducts from './create-demo-oem-customer-products.seed';
import CreateDemoOemApprovalQueuePriorities from './create-demo-oem-approval-queue-priorities.seed';
import CreateDemoOemQuotes from './create-demo-oem-quotes.seed';
import CreateDemoOemQuoteAndVendoUuids from './create-demo-oem-quote-and-vendo-uuids.seed';
import CreateDemoOemQuoteUsers from './create-demo-oem-quote-users.seed';
import CreateDemoOemQuoteApprovalQueues from './create-demo-oem-quote-approval-queues.seed';
import CreateDemoOemContacts from './create-demo-oem-contacts.seed';
import CreateDemoOemQuoteContacts from './create-demo-oem-quote-contacts.seed';
import CreateDemoOemQuoteCustomerProducts from './create-demo-oem-quote-customer-products.seed';
import CreateDemoOemQuoteMaterials from './create-demo-oem-quote-materials.seed';
import CreateDemoOemQuoteProducts from './create-demo-oem-quote-products.seed';

// TODO: import csv directly and apply necessary transformations
export default ({
  companyId = 1,
  companyName = 'Demo & Co.',
  subdomain = 'demo',
}: {
  companyId?: number;
  companyName?: string;
  subdomain?: string;
}) =>
  class CreateOemDemo implements Seeder {
    async seedGeoHierarchies(): Promise<OemHierarchyEntity> {
      await runSeeder(CreateDemoOemHierarchyLevels({ companyId }));
      return runSeeder(CreateDemoOemHierarchies({ companyId }));
    }

    public async run(factory: Factory, connection: Connection): Promise<any> {
      const company = await runSeeder(
        CreateDemoOemCompanies({
          companyId,
          companyName,
          subdomain,
        }),
      );
      const channels = await runSeeder(CreateDemoOemChannels);
      const addresses = await runSeeder(CreateDemoOemAddresses({ companyId }));
      const companyAddress = await runSeeder(
        CreateDemoOemCompanyAddresses({ companyId }),
      );

      const geoHierarchies = await this.seedGeoHierarchies();

      const roles = await runSeeder(CreateDemoOemRoles({ companyId }));
      const users = await runSeeder(CreateDemoOemUsers({ companyId }));

      const companyPrograms = await runSeeder(
        CreateDemoOemCompanyPrograms({ companyId }),
      );
      const licensingPrograms = await runSeeder(
        CreateDemoOemLicensingPrograms({ companyId }),
      );
      const companyChannelSettings = await runSeeder(
        CreateDemoOemCompanyChannelSettings(companyId, channels),
      );
      const companyChannels = await runSeeder(
        CreateDemoOemCompanyChannels({ companyId }),
      );

      const workflowRules = await runSeeder(
        CreateDemoOemWorkflowRules({ companyId }),
      );

      const visibleProductFields = await runSeeder(
        CreateDemoOemVisibleProductFields({ companyId }),
      );

      const materials = await runSeeder(CreateDemoOemMaterials({ companyId }));
      const discountRules = await runSeeder(
        CreateDemoOemDiscountRules({ companyId }),
      );
      const discounts = await runSeeder(CreateDemoOemDiscounts({ companyId }));

      const pricingModels = await runSeeder(
        CreateDemoOemPricingModels({ companyId }),
      );
      const unitTiers = await runSeeder(CreateDemoOemUnitTiers({ companyId }));
      const products = await runSeeder(CreateDemoOemProducts({ companyId }));
      const priceTiers = await runSeeder(
        CreateDemoOemPriceTiers({ companyId }),
      );

      const shadingRules = await runSeeder(
        CreateDemoOemShadingRulesSeed({ companyId }),
      );

      const customers = await runSeeder(CreateDemoOemCustomers({ companyId }));
      const customerAddresses = await runSeeder(
        CreateDemoOemCustomerAddresses({ companyId }),
      );
      const customerProducts = await runSeeder(
        CreateDemoOemCustomerProducts({ companyId }),
      );

      const approvalQueuePriorities = await runSeeder(
        CreateDemoOemApprovalQueuePriorities({ companyId }),
      );
      const quotes = await runSeeder(CreateDemoOemQuotes({ companyId }));
      const quoteAndVendoUuids = await runSeeder(
        CreateDemoOemQuoteAndVendoUuids({ companyId }),
      );
      const quoteUsers = await runSeeder(
        CreateDemoOemQuoteUsers({ companyId }),
      );
      const quoteApprovalQueues = await runSeeder(
        CreateDemoOemQuoteApprovalQueues({ companyId }),
      );
      const contacts = await runSeeder(CreateDemoOemContacts({ companyId }));
      const quoteContacts = await runSeeder(
        CreateDemoOemQuoteContacts({ companyId }),
      );
      const quoteCustomerProducts = await runSeeder(
        CreateDemoOemQuoteCustomerProducts({ companyId }),
      );
      const quoteMaterials = await runSeeder(
        CreateDemoOemQuoteMaterials({ companyId }),
      );
      const quoteProducts = await runSeeder(
        CreateDemoOemQuoteProducts({ companyId }),
      );

      const result = {
        company,
        addresses,
        companyAddress,
        geoHierarchies,
        roles,
        users,
        channels,
        companyPrograms,
        licensingPrograms,
        companyChannelSettings,
        companyChannels,
        workflowRules,
        visibleProductFields,
        materials,
        discountRules,
        discounts,
        pricingModels,
        unitTiers,
        products,
        priceTiers,
        shadingRules,
        customers,
        customerAddresses,
        customerProducts,
        approvalQueuePriorities,
        quotes,
        quoteAndVendoUuids,
        quoteUsers,
        quoteApprovalQueues,
        contacts,
        quoteContacts,
        quoteCustomerProducts,
        quoteMaterials,
        quoteProducts,
      };

      // Log the result whenever we reset data for the next few deployments.
      // console.log('result', result);

      return result;
    }
  };
