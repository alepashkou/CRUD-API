import cluster from 'cluster';
import os from 'os';

if (cluster.isPrimary) {
  const cpuCount = os.cpus().length;
  for (let i = 0; i < cpuCount; i++) {
    cluster.fork(cpuCount);
  }
}
if (cluster.isWorker) {
  import('./index.js');
}
