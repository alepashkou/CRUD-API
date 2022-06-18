import { server } from '../dist/index.js';
import request from 'supertest';

describe('Scenario 1', () => {
  let userId = '';

  test('Should return empty array', async () => {
    const responce = await request(server).get('/api/users');
    expect(responce.body).toEqual([]);
  });

  test('Should create user', async () => {
    const responce = await request(server)
      .post('/api/users')
      .send({
        username: 'John',
        age: 30,
        hobbies: ['Sports', 'Cooking'],
      });
    expect(responce.statusCode).toBe(201);
    expect(responce.body['username']).toBe('John');
    expect(responce.body['age']).toBe(30);
    expect(responce.body['hobbies']).toEqual(['Sports', 'Cooking']);
    userId = responce.body['id'];
  });

  test('Get created user', async () => {
    const responce = await request(server).get('/api/users/' + userId);
    expect(responce.statusCode).toBe(200);
    expect(responce.body['id']).toBe(userId);
    expect(responce.body['username']).toBe('John');
    expect(responce.body['age']).toBe(30);
  });

  test('Update user', async () => {
    const responce = await request(server)
      .put('/api/users/' + userId)
      .send({
        username: 'Johnik',
      });
    expect(responce.statusCode).toBe(200);
  });

  test('Delete created user', async () => {
    const responce = await request(server).delete('/api/users/' + userId);
    expect(responce.statusCode).toBe(204);
  });

  test('Check deleted user', async () => {
    const responce = await request(server).get('/api/users');
    expect(responce.statusCode).toBe(200);
    expect(responce.body).toEqual([]);
  });

  afterAll(() => {
    server.close();
  });
});
