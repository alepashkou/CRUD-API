import http from 'http';
import 'dotenv/config';
import cluster from 'cluster';
import { getUsers } from './controllers/getUsers.js';
import { getUser } from './controllers/getUser.js';
import { addUser } from './controllers/addUser.js';
import { updateUser } from './controllers/updateUser.js';
import { deleteUser } from './controllers/deleteUser.js';
import { User } from './user.js';

const PORT: number = +process.env.PORT || 4000;

let mainData: User[] = [];

export const server: http.Server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    const urlArray: string[] = req.url.split('/');
    if (req.url === '/api/users' && req.method === 'GET') {
      getUsers(res, mainData);
    } else if (
      urlArray.length > 3 &&
      urlArray.length < 5 &&
      req.method === 'GET'
    ) {
      getUser(res, mainData, urlArray[3]);
    } else if (req.url === '/api/users' && req.method === 'POST') {
      let data: string = '';
      req.on('data', (chunk) => {
        data += chunk;
      });
      req.on('end', () => {
        try {
          addUser(JSON.parse(data.toString()), res, mainData);
        } catch (e) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Server error' }));
        }
      });
    } else if (
      urlArray.length > 3 &&
      urlArray.length < 5 &&
      req.method === 'PUT'
    ) {
      let data: string = '';
      req.on('data', (chunk) => {
        data += chunk;
      });
      req.on('end', () => {
        try {
          updateUser(JSON.parse(data.toString()), urlArray[3], res, mainData);
        } catch (e) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Server error' }));
        }
      });
    } else if (
      urlArray.length > 3 &&
      urlArray.length < 5 &&
      req.method === 'DELETE'
    ) {
      const index = deleteUser(urlArray[3], res, mainData);
      if (index !== false) {
        mainData.splice(+index, 1);
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Not found' }));
    }
  }
);
server.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}, process id is ${process.pid}`
  );
});
if (cluster.isWorker) {
  process.on('message', (data: User[]) => {
    mainData = data;
  });
}
