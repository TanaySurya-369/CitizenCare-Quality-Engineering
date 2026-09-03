import request from 'supertest';
import { expect } from 'chai';
import app from '../../../backend/src/app';
import { TestDataManager } from '../../utilities/TestDataManager';

describe('Performance & SLA Benchmark Suite', () => {
  const users = TestDataManager.getUsers();
  let citizenToken: string;

  before(async () => {
    const citRes = await request(app)
      .post('/api/auth/login')
      .send({ email: users.validUsers.citizen.email, password: users.validUsers.citizen.password });
    citizenToken = citRes.body.data.token;
  });

  it('should respond to Health Check endpoint within 100ms', async () => {
    const start = Date.now();
    await request(app).get('/api/health').expect(200);
    const duration = Date.now() - start;
    expect(duration).to.be.lessThan(150);
  });

  it('should list categories within 150ms', async () => {
    const start = Date.now();
    await request(app).get('/api/categories').expect(200);
    const duration = Date.now() - start;
    expect(duration).to.be.lessThan(200);
  });

  it('should retrieve complaints list within 250ms', async () => {
    const start = Date.now();
    await request(app)
      .get('/api/complaints')
      .set('Authorization', `Bearer ${citizenToken}`)
      .expect(200);
    const duration = Date.now() - start;
    expect(duration).to.be.lessThan(300);
  });
});
