export enum QueueNames {
  SyncSalesForce = 'sync-salesforce', // batch sync salesforce queue
  PdfExport = 'pdf-export-queue',
  BatchedEmail = 'batched-email-queue',
  VendoApproval = 'vendo-approval-queue',
  QuoteApproval = 'quote-approval-queue',
}

export enum JobNames {
  BatchSyncQuotesToSF = 'batch-sync-quotes-to-salesforce', // job name for batch syncing quotes
  RealTimeSyncQuoteToSF = 'realtime-sync-quote-to-salesforce',
  RealTimeSyncProductToSF = 'realtime-sync-product-to-salesforce',
  CreateAssetToSF = 'create-asset-in-salesforce',
}
