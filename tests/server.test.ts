import { server } from '../dist/index.js';
import request from 'supertest';
describe('Testing', () => {
  describe('Scenario 1 (all function)', () => {
    let userId: string = '';

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
  });
  describe('Scenario 2 (create many users)', () => {
    let usersIds: string[] = [];
    test('Create users (1000)', async () => {
      for (let i = 0; i <= 1000; i++) {
        const responce = await request(server)
          .post('/api/users')
          .send({
            username: 'Test ' + i,
            age: 30,
            hobbies: [],
          });
        expect(responce.statusCode).toBe(201);
        usersIds.push(responce.body['id']);
      }
    });
    test('Delete users (1000)', async () => {
      for (let i = 0; i <= 1000; i++) {
        const responce = await request(server).delete(
          '/api/users/' + usersIds[i]
        );
        expect(responce.statusCode).toBe(204);
      }
    });
  });
  describe('Scenario 3 (handle errors)', () => {
    test('Non-existing endpoint (404)', async () => {
      const responce = await request(server).get('/some-non');
      expect(responce.statusCode).toBe(404);
    });
    test('User id not valid (400)', async () => {
      const responce = await request(server).get('/api/users/123123123adsdsa');
      expect(responce.statusCode).toBe(400);
    });
    test('User not found (404)', async () => {
      const responce = await request(server).get(
        '/api/users/a889e0f7-d734-4e4e-ab66-192047a97c89'
      );
      expect(responce.statusCode).toBe(404);
    });
    test('Create user not required fields (400)', async () => {
      const responce = await request(server).post('/api/users').send({
        age: 30,
      });
      expect(responce.statusCode).toBe(400);
    });
    test('Update user id not valid (400)', async () => {
      const responce = await request(server)
        .put('/api/users/123123123adsdsa')
        .send({});
      expect(responce.statusCode).toBe(400);
    });
    test('Update user id not found (404)', async () => {
      const responce = await request(server)
        .put('/api/users/a889e0f7-d734-4e4e-ab66-192047a97c89')
        .send({});
      expect(responce.statusCode).toBe(404);
    });
    test('Delete user id not valid (400)', async () => {
      const responce = await request(server).delete(
        '/api/users/123123123adsdsa'
      );
      expect(responce.statusCode).toBe(400);
    });
    test('Delete user id not found (404)', async () => {
      const responce = await request(server).delete(
        '/api/users/a889e0f7-d734-4e4e-ab66-192047a97c89'
      );
      expect(responce.statusCode).toBe(404);
    });
    test('Server error (500)', async () => {
      const responce = await request(server).post('/api/users').send(undefined);
      expect(responce.statusCode).toBe(500);
    });
  });
  afterAll(() => {
    server.close();
  });
});
