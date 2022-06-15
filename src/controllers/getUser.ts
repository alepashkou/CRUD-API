import { User } from '../user';
import * as http from 'http';
import { validate as uuidValidate } from 'uuid';

export const getUser = async (
  res: http.ServerResponse,
  data: User[],
  id: string
) => {
  if (uuidValidate(id)) {
    const user = data.find((user) => user.id === id);
    if (user) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User not found' }));
    }
  } else {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not uuid' }));
  }
};
