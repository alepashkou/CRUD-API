import { User } from '../user';
import * as http from 'http';
import { validate as uuidValidate } from 'uuid';

export const deleteUser = (
  uuid: string,
  res: http.ServerResponse,
  data: User[]
): number | boolean => {
  if (uuidValidate(uuid)) {
    const userIndex: number = data.findIndex((user) => user.id === uuid);
    if (userIndex !== -1) {
      res.writeHead(204, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User Deleted' }));
      process.send(data);
      return userIndex;
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User not found' }));
    }
  } else {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not uuid' }));
  }
  return false;
};
