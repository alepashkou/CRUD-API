import { User } from '../user';
import * as http from 'http';
import { v4 as uuidv4 } from 'uuid';

export const validateUser = (user: User): string[] => {
  const errors: string[] = [];
  if (!user.username) {
    errors.push('Username');
  }
  if (!user.age) {
    errors.push('Age');
  }
  if (!user.hobbies) {
    errors.push('Hobbies');
  }
  return errors;
};
export const addUser = (
  reqData: User,
  res: http.ServerResponse,
  data: User[]
): void => {
  if (validateUser(reqData).length === 0) {
    const newUser: User = { id: uuidv4(), ...reqData };
    data.push(newUser);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(newUser));
    process.send(data);
  } else {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        message:
          'Bad request, not contain required fields: ' + validateUser(reqData),
      })
    );
  }
};
