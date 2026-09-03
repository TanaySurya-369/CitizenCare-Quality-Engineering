import request from 'supertest';
import { expect } from 'chai';
import app from '../../../backend/src/app';
import { TestDataManager } from '../../utilities/TestDataManager';

describe('REST API Test Suite: Authentication & Authorization Flow', () => {
  const users = TestDataManager.getUsers();
  const invalidData = TestDataManager.getInvalidData();

  describe('POST /api/auth/register', () => {
    it('should successfully register a new citizen user', async () => {
      const uniqueEmail = TestDataManager.generateUniqueEmail('citizen.new');
      const payload = {
        name: 'Automated New Citizen',
        email: uniqueEmail,
        password: 'Password@123',
        phone: '+1 555-0999',
        role: 'CITIZEN',
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(payload)
        .expect(201);

      expect(res.body.success).to.be.true;
      expect(res.body.data).to.have.property('token');
      expect(res.body.data.user).to.have.property('id');
      expect(res.body.data.user.email).to.equal(uniqueEmail.toLowerCase());
      expect(res.body.data.user.role).to.equal('CITIZEN');
      expect(res.body.data.user).to.not.have.property('passwordHash');
    });

    it('should reject registration if email is already taken', async () => {
      const payload = {
        name: 'Duplicate John',
        email: users.validUsers.citizen.email,
        password: 'Password@123',
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(payload)
        .expect(409);

      expect(res.body.success).to.be.false;
      expect(res.body.errorCode).to.equal('USER_ALREADY_EXISTS');
    });

    it('should reject registration with invalid email or short password', async () => {
      const payload = {
        name: 'J',
        email: 'invalid-email-address',
        password: '123',
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(payload)
        .expect(400);

      expect(res.body.success).to.be.false;
      expect(res.body.errorCode).to.equal('VALIDATION_ERROR');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should successfully authenticate citizen and return valid JWT token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: users.validUsers.citizen.email,
          password: users.validUsers.citizen.password,
        })
        .expect(200);

      expect(res.body.success).to.be.true;
      expect(res.body.data).to.have.property('token');
      expect(res.body.data.user.email).to.equal(users.validUsers.citizen.email.toLowerCase());
      expect(res.body.data.user.role).to.equal('CITIZEN');
    });

    it('should successfully authenticate municipal staff member', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: users.validUsers.staffRoads.email,
          password: users.validUsers.staffRoads.password,
        })
        .expect(200);

      expect(res.body.success).to.be.true;
      expect(res.body.data.user.role).to.equal('STAFF');
    });

    it('should successfully authenticate city administrator', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: users.validUsers.admin.email,
          password: users.validUsers.admin.password,
        })
        .expect(200);

      expect(res.body.success).to.be.true;
      expect(res.body.data.user.role).to.equal('ADMIN');
    });

    it('should reject invalid passwords with 401 status code', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: users.validUsers.citizen.email,
          password: 'IncorrectPassword!999',
        })
        .expect(401);

      expect(res.body.success).to.be.false;
      expect(res.body.errorCode).to.equal('INVALID_CREDENTIALS');
    });

    it('should reject empty login body with 400 validation error', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);

      expect(res.body.success).to.be.false;
      expect(res.body.errorCode).to.equal('VALIDATION_ERROR');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should retrieve current user profile when valid token provided', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: users.validUsers.citizen.email,
          password: users.validUsers.citizen.password,
        });

      const token = loginRes.body.data.token;

      const profileRes = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(profileRes.body.success).to.be.true;
      expect(profileRes.body.data.user.email).to.equal(users.validUsers.citizen.email.toLowerCase());
    });

    it('should return 401 when Authorization header is missing', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(res.body.success).to.be.false;
      expect(res.body.errorCode).to.equal('UNAUTHORIZED');
    });
  });
});
