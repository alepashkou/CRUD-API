import http from 'http';
import 'dotenv/config';
import { User } from './user';
import { getUsers } from './controllers/getUsers.js';
import { getUser } from './controllers/getUser.js';
import { addUser } from './controllers/addUser.js';
import { updateUser } from './controllers/updateUser.js';
import { deleteUser } from './controllers/deleteUser.js';

const PORT: number = +process.env.PORT || 4000;
const mainData: User[] = [
  // {
  //   id: 'a889e0f7-d734-4e4e-ab66-192047a97c89',
  //   username: 'John',
  //   age: 30,
  //   hobbies: ['Sports', 'Cooking'],
  // },
];
export const server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    const urlArray: string[] = req.url.split('/');
    if (req.url === '/api/users' && req.method === 'GET') {
      getUsers(res, mainData);
    } else if (urlArray.length < 5 && req.method === 'GET') {
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
    } else if (urlArray.length < 5 && req.method === 'PUT') {
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
    } else if (urlArray.length < 5 && req.method === 'DELETE') {
      const index = deleteUser(urlArray[3], res, mainData);
      if (index !== false) {
        mainData.splice(index, 1);
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
