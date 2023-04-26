import { BatchedEmailQueueConsumer } from './batched-email-queue.consumer';
import { SyncSalesForceQueueConsumer } from './sync-salesforce-queue.consumer';
import { PdfExportQueueConsumer } from './pdf-export-queue.consumer';
import { QuoteApprovalQueueConsumer } from './quote-approval-queue.consumer';
import { VendoApprovalQueueConsumer } from './vendo-approval-queue.consumer';

export const QueueConsumers = [
  SyncSalesForceQueueConsumer,
  BatchedEmailQueueConsumer,
  PdfExportQueueConsumer,
  QuoteApprovalQueueConsumer,
  VendoApprovalQueueConsumer,
];
