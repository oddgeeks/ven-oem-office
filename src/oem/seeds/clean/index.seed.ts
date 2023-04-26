import { Factory, runSeeder, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import CreateCleanOemCompanies from './create-clean-oem-companies.seed';
import CreateCleanOemAddresses from './create-clean-oem-addresses.seed';
import CreateCleanOemCompanyAddresses from './create-clean-oem-company-addresses.seed';
import CreateCleanOemRoles from './create-clean-oem-roles.seed';
import CreateCleanOemUsers from './create-clean-oem-users.seed';
import { OemHierarchyEntity } from '../../main/oem-hierarchies/oem-hierarchy.entity';
import CreateCleanOemHierarchyLevels from './create-clean-oem-hierarchy-levels.seed';
import CreateCleanOemHierarchies from './create-clean-oem-hierarchies.seed';
import CreateCleanOemChannels from './create-clean-oem-channels.seed';
import CreateCleanOemCompanyPrograms from './create-clean-oem-company-programs.seed';
import CreateCleanOemLicensingPrograms from './create-clean-oem-licensing-programs.seed';
import CreateCleanOemCompanyChannelSettings from './create-clean-oem-company-channel-settings.seed';
import CreateCleanOemCompanyChannels from './create-clean-oem-company-channels.seed';
import CreateCleanOemWorkflowRules from './create-clean-oem-workflow-rules.seed';
import CreateCleanOemVisibleProductFields from './create-clean-oem-visible-product-fields.seed';
import CreateCleanOemApprovalQueuePriorities from './create-clean-oem-approval-queue-priorities.seed';

// TODO: import csv directly and apply necessary transformations
export default ({
  companyId = 2,
  companyName = 'Clean',
  subdomain = 'clean',
}: {
  companyId?: number;
  companyName?: string;
  subdomain?: string;
}) =>
  class CreateOemClean implements Seeder {
    async seedGeoHierarchies(): Promise<OemHierarchyEntity> {
      await runSeeder(CreateCleanOemHierarchyLevels({ companyId }));
      return runSeeder(CreateCleanOemHierarchies({ companyId }));
    }

    public async run(factory: Factory, connection: Connection): Promise<any> {
      const company = await runSeeder(
        CreateCleanOemCompanies({
          companyId,
          companyName,
          subdomain,
          emailDomain: 'bloodandtreasure,vendori,10pearls',
          companyEmail: 'clean@vendori.com',
        }),
      );
      const addresses = await runSeeder(CreateCleanOemAddresses({ companyId }));
      const companyAddress = await runSeeder(
        CreateCleanOemCompanyAddresses({ companyId }),
      );

      const geoHierarchies = await this.seedGeoHierarchies();

      const roles = await runSeeder(CreateCleanOemRoles({ companyId }));
      const users = await runSeeder(CreateCleanOemUsers({ companyId }));

      const channels = await runSeeder(CreateCleanOemChannels);
      const companyPrograms = await runSeeder(
        CreateCleanOemCompanyPrograms({ companyId }),
      );
      const licensingPrograms = await runSeeder(
        CreateCleanOemLicensingPrograms({ companyId }),
      );
      const companyChannelSettings = await runSeeder(
        CreateCleanOemCompanyChannelSettings(companyId, channels),
      );
      const companyChannels = await runSeeder(
        CreateCleanOemCompanyChannels({ companyId }),
      );

      const workflowRules = await runSeeder(
        CreateCleanOemWorkflowRules({ companyId }),
      );

      const visibleProductFields = await runSeeder(
        CreateCleanOemVisibleProductFields({ companyId }),
      );

      const approvalQueuePriorities = await runSeeder(
        CreateCleanOemApprovalQueuePriorities({ companyId }),
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
        approvalQueuePriorities,
      };

      // Log the result whenever we reset data for the next few deployments.
      // console.log('result', result);

      return result;
    }
  };
