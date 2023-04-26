import * as _cluster from 'cluster';
const cluster = _cluster as unknown as _cluster.Cluster;
import { cpus } from 'node:os';
import { Injectable } from '@nestjs/common';

const numCPUs = cpus().length;

@Injectable()
export class AppClusterService {
  static clusterize(callback): void {
    if (cluster.isPrimary) {
      console.log(`Master server started on ${process.pid}`);
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }
      cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting`);
        cluster.fork();
      });
    } else {
      console.log(`Cluster server started on ${process.pid}`);
      callback();
    }
  }
}
