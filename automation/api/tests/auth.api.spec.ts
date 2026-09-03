import request from 'supertest';
import { expect } from 'chai';
import app from '../../../backend/src/app';
import { AuthPayloads } from '../payloads/auth.payloads';

describe('Enterprise REST API: Authentication, Tokens & Profile', () => {
  let citizenToken: string;

  describe('POST /api/auth/register', () => {
    it('should register a new citizen with valid fields and return 201 Created', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(AuthPayloads.validCitizen)
        .expect(201);

      expect(res.body.success).to.be.true;
      expect(res.body.data.user).to.have.property('id');
      expect(res.body.data.user.email).to.equal(AuthPayloads.validCitizen.email);
      expect(res.body.data).to.have.property('token');
    });

    it('should reject registration with invalid email format (400 Bad Request)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(AuthPayloads.invalidEmail)
        .expect(400);

      expect(res.body.success).to.be.false;
      expect(res.body.errorCode).to.equal('VALIDATION_ERROR');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate citizen and return valid JWT session token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send(AuthPayloads.loginCitizen)
        .expect(200);

      expect(res.body.success).to.be.true;
      expect(res.body.data.token).to.be.a('string');
      citizenToken = res.body.data.token;
    });

    it('should reject invalid password with 401 Unauthorized', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: AuthPayloads.loginCitizen.email, password: 'WrongPassword99!' })
        .expect(401);

      expect(res.body.success).to.be.false;
    });
  });

  describe('GET /api/auth/me', () => {
    it('should retrieve authenticated user profile with Bearer token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${citizenToken}`)
        .expect(200);

      expect(res.body.success).to.be.true;
      expect(res.body.data.user.email).to.equal(AuthPayloads.loginCitizen.email);
    });

    it('should return 401 Unauthorized when Authorization header is missing', async () => {
      await request(app).get('/api/auth/me').expect(401);
    });
  });
});
