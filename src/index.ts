import * as http from 'http';
import 'dotenv/config';
import { User } from './types/user.js';
const PORT: number = +process.env.PORT || 4000;
const mainData: User[] = [
  {
    id: '1',
    username: 'John',
    age: 30,
    hobbies: ['Sports', 'Cooking'],
  },
];
const server: http.Server = http
  .createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    console.log(mainData);
  })
  .listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
