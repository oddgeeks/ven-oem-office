import { Router } from 'express';
import * as bull from 'bull';
import * as basicAuth from 'express-basic-auth';
// eslint-disable-next-line
const bullArena = require('bull-arena');

import * as config from '../../environments';
import { QueueNames } from './queues.enums/queue-enum';

export const bullRouter = Router();

const jobs: any[] = [
  {
    name: QueueNames.QuoteApproval,
  },
  {
    name: QueueNames.VendoApproval,
  },
  {
    name: QueueNames.BatchedEmail,
  },
  {
    name: QueueNames.PdfExport,
  },
];

const jobsList = jobs.map((job) => {
  job.hostId = 'jobs';

  job.redis = config.redis;

  return job;
});

const arena = bullArena(
  {
    Bull: bull,
    queues: [...jobsList],
  },
  {
    basePath: '/jobs-dashboard',
    disableListen: true,
  },
);

bullRouter.use(
  '/jobs-dashboard',
  basicAuth({
    users: {
      [config.BULL_ADMIN_USERNAME]: config.BULL_ADMIN_PASSWORD,
    },
    challenge: true,
  }),
);

bullRouter.use('/', arena);
