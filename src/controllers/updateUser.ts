import { User } from '../user';
import * as http from 'http';
import { validate as uuidValidate } from 'uuid';

export const updateUser = (
  updatedInfo: User,
  uuid: string,
  res: http.ServerResponse,
  data: User[]
): void => {
  if (uuidValidate(uuid)) {
    const userIndex: number = data.findIndex((user) => user.id === uuid);
    if (userIndex !== -1) {
      data[userIndex] = { ...data[userIndex], ...updatedInfo };
      data[userIndex] = {
        ...data[userIndex],
        age: Number(data[userIndex].age),
      };
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data[userIndex]));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User not found' }));
    }
  } else {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not uuid' }));
  }
};
