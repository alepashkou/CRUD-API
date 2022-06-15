import http from 'http';
import 'dotenv/config';
import { User } from './user';
import { getUsers } from './controllers/getUsers.js';
import { getUser } from './controllers/getUser.js';
// import { v4 as uuidv4} from 'uuid';
const PORT: number = +process.env.PORT || 4000;
const mainData: User[] = [
  {
    id: 'a889e0f7-d734-4e4e-ab66-192047a97c89',
    username: 'John',
    age: 30,
    hobbies: ['Sports', 'Cooking'],
  },
];
http
  .createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    const urlArray: string[] = req.url.split('/');
    if (req.url === '/api/users' && req.method === 'GET') {
      getUsers(res, mainData);
    } else if (urlArray.length < 5 && req.method === 'GET') {
      getUser(res, mainData, urlArray[3]);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Not found' }));
    }
  })
  .listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
