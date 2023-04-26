import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import * as moment from 'moment-timezone';

import { OemQuoteApprovalQueue } from '../../intermediaries/_oem-approval-queues/_oem-quote-approval-queues/oem-quote-approval-queue.entity';
import { QuoteApprovalQueueStatusEnum } from '../../intermediaries/_oem-approval-queues/_oem-quote-approval-queues/oem-quote-approval-queue.enums/quote-approval-queue-status.enum';
import { QuoteApprovalQueueTargetTypeEnum } from '../../intermediaries/_oem-approval-queues/_oem-quote-approval-queues/oem-quote-approval-queue.enums/quote-approval-queue-target-type.enum';
import { seedEntities } from '../../../utils/seed-factory.util';

export default ({ companyId = 1 }: { companyId?: number }) =>
  class CreateDemoOemQuoteApprovalQueues implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
      const quoteApprovalQueues: Partial<OemQuoteApprovalQueue>[] = [
        {
          companyId,
          userId: 2,
          quoteId: 1,
          approvalQueuePriorityId: 2,
          token:
            'eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoicXVvdGVfYXBwcm92YWxfcXVldWUiLCJpZCI6MSwiaWF0IjoxNjczODEyNDEyLCJleHAiOjE2NzY0OTA4MTJ9.MYMnmaXzQ-IETWAd414ltjxThbK1ml7E8Ddj-D--NPg137OWW8jC2L_JsqBH924f',
          status: QuoteApprovalQueueStatusEnum.APPROVED,
          targetType: QuoteApprovalQueueTargetTypeEnum.INTERNAL,
          isActive: false,
          isEnabled: false,
          expiresAt: moment.utc('2023-02-15 19:53:32.413000 +00:00').toDate(),
        },
        {
          companyId,
          userId: 2,
          quoteId: 1,
          approvalQueuePriorityId: 2,
          token:
            'eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoicXVvdGVfYXBwcm92YWxfcXVldWUiLCJpZCI6MiwiaWF0IjoxNjczODEyNTczLCJleHAiOjE2NzY0OTA5NzN9.0c7yg8VFwA20sQDrCvHBlNc2VVTvrgNp_gFRAVRGMOwBMsCffFx4mQIMZU8_ZMt1',
          status: QuoteApprovalQueueStatusEnum.APPROVED,
          targetType: QuoteApprovalQueueTargetTypeEnum.INTERNAL,
          isActive: false,
          isEnabled: false,
          expiresAt: moment.utc('2023-02-15 19:56:13.707000 +00:00').toDate(),
        },
        {
          companyId,
          userId: 2,
          quoteId: 1,
          approvalQueuePriorityId: 2,
          token:
            'eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoicXVvdGVfYXBwcm92YWxfcXVldWUiLCJpZCI6NCwiaWF0IjoxNjczODM1OTg5LCJleHAiOjE2NzY1MTQzODl9.yQpBVyydxdT0jidkl3MI7Ar22vreciCxpR5KJ_OwkWASHYFTWFSXj4m4yY8ASmJM',
          status: QuoteApprovalQueueStatusEnum.APPROVED,
          targetType: QuoteApprovalQueueTargetTypeEnum.INTERNAL,
          isActive: false,
          isEnabled: false,
          expiresAt: moment.utc('2023-02-16 02:26:29.342000 +00:00').toDate(),
        },
        {
          companyId,
          userId: 2,
          quoteId: 6,
          approvalQueuePriorityId: 2,
          token:
            'eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoicXVvdGVfYXBwcm92YWxfcXVldWUiLCJpZCI6NSwiaWF0IjoxNjc0MDU5MTQ0LCJleHAiOjE2NzY3Mzc1NDR9.bgJdNfp_XhI4jskK6l-0PQ8U5aBICK5Rz0v5KhpWPxrpRnE28A-C83fQe2BuBhdZ',
          status: QuoteApprovalQueueStatusEnum.APPROVED,
          targetType: QuoteApprovalQueueTargetTypeEnum.INTERNAL,
          isActive: false,
          isEnabled: false,
          expiresAt: moment.utc('2023-02-18 16:25:44.100000 +00:00').toDate(),
        },
        {
          companyId,
          userId: 2,
          quoteId: 6,
          approvalQueuePriorityId: 2,
          token:
            'eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoicXVvdGVfYXBwcm92YWxfcXVldWUiLCJpZCI6OCwiaWF0IjoxNjc0MDU5Mjg3LCJleHAiOjE2NzY3Mzc2ODd9.pIjK2_DQ_aPaTK3EDu_4R5YbSHlxI9-u82sx4NaPKXxK4tkxtk_H11XtMNfxgeGz',
          status: QuoteApprovalQueueStatusEnum.APPROVED,
          targetType: QuoteApprovalQueueTargetTypeEnum.INTERNAL,
          isActive: false,
          isEnabled: false,
          expiresAt: moment.utc('2023-02-18 16:28:07.180000 +00:00').toDate(),
        },
        {
          companyId,
          userId: 2,
          quoteId: 8,
          approvalQueuePriorityId: 2,
          token:
            'eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoicXVvdGVfYXBwcm92YWxfcXVldWUiLCJpZCI6MTQsImlhdCI6MTY3NTEwODE0MCwiZXhwIjoxNjc3NjEzNzQwfQ.Pq3ejm5-CIWLoY-vdNQUNpbYwQe7b6nOsKKUX70Eneu7uxgWaXoBaas2GE-tmwFK',
          status: QuoteApprovalQueueStatusEnum.APPROVED,
          targetType: QuoteApprovalQueueTargetTypeEnum.INTERNAL,
          isActive: false,
          isEnabled: false,
          expiresAt: moment.utc('2023-02-28 19:49:00.522000 +00:00').toDate(),
        },
        {
          companyId,
          userId: 2,
          quoteId: 8,
          approvalQueuePriorityId: 2,
          token:
            'eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoicXVvdGVfYXBwcm92YWxfcXVldWUiLCJpZCI6MTcsImlhdCI6MTY3NTEzMDE1NCwiZXhwIjoxNjc3NTQ5MzU0fQ.T6PqO9wbQzUzjnEtZB0tWvwr4c6kZOaRbh_c0jHOhO9e0hn5UK5GNWc5PRy8RWf9',
          status: QuoteApprovalQueueStatusEnum.APPROVED,
          targetType: QuoteApprovalQueueTargetTypeEnum.INTERNAL,
          isActive: false,
          isEnabled: false,
          expiresAt: moment.utc('2023-02-28 01:55:54.876000 +00:00').toDate(),
        },
        {
          companyId,
          userId: 2,
          quoteId: 8,
          approvalQueuePriorityId: 2,
          token:
            'eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoicXVvdGVfYXBwcm92YWxfcXVldWUiLCJpZCI6NTAsImlhdCI6MTY3NTE5MTUxNywiZXhwIjoxNjc3NjEwNzE3fQ.Yg5A_raMxAuLYY4xKvd-PlMpHg9uKbBmanCIuYIJ70f7127Mqem7HfFJC0bDvHn4',
          status: QuoteApprovalQueueStatusEnum.PENDING,
          targetType: QuoteApprovalQueueTargetTypeEnum.INTERNAL,
          isActive: false,
          isEnabled: false,
          expiresAt: moment.utc('2023-02-28 18:58:37.796000 +00:00').toDate(),
        },
        {
          companyId,
          userId: 2,
          quoteId: 6,
          approvalQueuePriorityId: 2,
          token:
            'eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoicXVvdGVfYXBwcm92YWxfcXVldWUiLCJpZCI6MTEsImlhdCI6MTY3NDU0MDI3NiwiZXhwIjoxNjc3MjE4Njc2fQ.iknk0zu4EJLP_dsXs7fD5_apUZrZkLWbuWMwrKFc0SeqZES_IjYtFLYQOqFbuPJ0',
          status: QuoteApprovalQueueStatusEnum.APPROVED,
          targetType: QuoteApprovalQueueTargetTypeEnum.INTERNAL,
          isActive: false,
          isEnabled: false,
          expiresAt: moment.utc('2023-02-24 06:04:36.060000 +00:00').toDate(),
        },
        {
          companyId,
          userId: 2,
          quoteId: 7,
          approvalQueuePriorityId: 2,
          token:
            'eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoicXVvdGVfYXBwcm92YWxfcXVldWUiLCJpZCI6NTUsImlhdCI6MTY3NTMxMDIwMCwiZXhwIjoxNjc3NzI5NDAwfQ.yL1lIckDNQi4Pnrl9dTpQOa9QdOxYXi_TRbu8gfEnj5iXN4kV9oWtW2leaO2z88c',
          status: QuoteApprovalQueueStatusEnum.APPROVED,
          targetType: QuoteApprovalQueueTargetTypeEnum.INTERNAL,
          isActive: true,
          isEnabled: true,
          expiresAt: moment.utc('2023-03-02 03:56:40.167000 +00:00').toDate(),
        },
        {
          companyId,
          userId: 2,
          quoteId: 6,
          approvalQueuePriorityId: 2,
          token:
            'eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoicXVvdGVfYXBwcm92YWxfcXVldWUiLCJpZCI6NTgsImlhdCI6MTY3NTc1MDkwNCwiZXhwIjoxNjc4MTcwMTA0fQ.u1tTxwlOVkKvKUYtth3dNs4K5fvBb61KpTo8Eb-5pKMONek8dqQvRaVnZEa0vPta',
          status: QuoteApprovalQueueStatusEnum.PENDING,
          targetType: QuoteApprovalQueueTargetTypeEnum.INTERNAL,
          isActive: false,
          isEnabled: false,
          expiresAt: moment.utc('2023-03-07 06:21:44.441000 +00:00').toDate(),
        },
        {
          companyId,
          userId: 2,
          quoteId: 6,
          approvalQueuePriorityId: 2,
          token:
            'eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoicXVvdGVfYXBwcm92YWxfcXVldWUiLCJpZCI6NjEsImlhdCI6MTY3NTc1MTA5MywiZXhwIjoxNjc4MTcwMjkzfQ.X02iyp_GdUb-_AFj4JmV-apLgGOg5uQf-qaJj741hdkZKmwn53NvmGOAlOk8yUOx',
          status: QuoteApprovalQueueStatusEnum.PENDING,
          targetType: QuoteApprovalQueueTargetTypeEnum.INTERNAL,
          isActive: true,
          isEnabled: true,
          expiresAt: moment.utc('2023-03-07 06:24:53.389000 +00:00').toDate(),
        },
        {
          companyId,
          userId: 2,
          quoteId: 48,
          approvalQueuePriorityId: 2,
          token:
            'eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoicXVvdGVfYXBwcm92YWxfcXVldWUiLCJpZCI6NjUsImlhdCI6MTY3NTc1MjQ5MCwiZXhwIjoxNjc4MTcxNjkwfQ.JNa0pPwOuPQCoCJdaXUIXN3-FZlI9IddKaNrJa7dP24nqHDQPpyw87KU7BoPU-H-',
          status: QuoteApprovalQueueStatusEnum.PENDING,
          targetType: QuoteApprovalQueueTargetTypeEnum.INTERNAL,
          isActive: false,
          isEnabled: false,
          expiresAt: moment.utc('2023-03-07 06:48:10.202000 +00:00').toDate(),
        },
        {
          companyId,
          userId: 2,
          quoteId: 49,
          approvalQueuePriorityId: 2,
          token:
            'eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoicXVvdGVfYXBwcm92YWxfcXVldWUiLCJpZCI6NjcsImlhdCI6MTY3NTgzMTE3MiwiZXhwIjoxNjc4MjUwMzcyfQ.DEpPaH3xOvK7yEkdjQXse9FmGUluwAmu4UeYYDYVd6rcb4JbOefMzceML59h-Y1E',
          status: QuoteApprovalQueueStatusEnum.PENDING,
          targetType: QuoteApprovalQueueTargetTypeEnum.EXTERNAL,
          isActive: true,
          isEnabled: true,
          expiresAt: moment.utc('2023-03-08 04:39:32.524000 +00:00').toDate(),
        },
      ];

      const quoteApprovalQueueEntities = await seedEntities(
        connection,
        OemQuoteApprovalQueue,
        quoteApprovalQueues,
      );

      return quoteApprovalQueueEntities;
    }
  };
