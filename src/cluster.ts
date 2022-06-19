import cluster from 'cluster';
import { cpus } from 'os';
import { User } from './user.js';

if (cluster.isPrimary) {
  const arrayWorkers = [];
  let mainData: User[] = [];
  cpus().forEach(() => {
    const worker = cluster.fork();
    arrayWorkers.push(worker);
    worker.on('message', (newData) => {
      mainData = newData;
      arrayWorkers.forEach((worker) => {
        worker.send(mainData);
      });
    });
  });
}
if (cluster.isWorker) {
  import('./index.js');
}
