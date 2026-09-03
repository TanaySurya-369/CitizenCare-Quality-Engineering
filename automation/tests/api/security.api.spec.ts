import request from 'supertest';
import { expect } from 'chai';
import app from '../../../backend/src/app';
import { TestDataManager } from '../../utilities/TestDataManager';

describe('Security Test Suite: RBAC Barriers & Injection Sanitization', () => {
  const users = TestDataManager.getUsers();
  const invalidData = TestDataManager.getInvalidData();
  let citizenToken: string;

  before(async () => {
    const citRes = await request(app)
      .post('/api/auth/login')
      .send({ email: users.validUsers.citizen.email, password: users.validUsers.citizen.password });
    citizenToken = citRes.body.data.token;
  });

  describe('RBAC Role Barriers (403 Forbidden Verification)', () => {
    it('should reject Citizen accessing Admin Audit Logs with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/admin/audit-logs')
        .set('Authorization', `Bearer ${citizenToken}`)
        .expect(403);

      expect(res.body.success).to.be.false;
      expect(res.body.errorCode).to.equal('FORBIDDEN');
    });

    it('should reject Citizen accessing Admin Users List with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${citizenToken}`)
        .expect(403);

      expect(res.body.success).to.be.false;
      expect(res.body.errorCode).to.equal('FORBIDDEN');
    });
  });

  describe('JWT Token Security & Tampering', () => {
    it('should reject tampered JWT tokens with 401 Invalid Token', async () => {
      const tamperedToken = citizenToken.slice(0, -5) + 'abcde';

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${tamperedToken}`)
        .expect(401);

      expect(res.body.success).to.be.false;
      expect(res.body.errorCode).to.equal('INVALID_TOKEN');
    });

    it('should reject fake bearer tokens', async () => {
      const res = await request(app)
        .get('/api/complaints')
        .set('Authorization', 'Bearer not-a-jwt')
        .expect(401);

      expect(res.body.success).to.be.false;
    });
  });

  describe('SQL Injection Sanitization', () => {
    it('should safely sanitize search queries and prevent SQL injection leaks', async () => {
      for (const payload of invalidData.sqlInjectionPayloads) {
        const res = await request(app)
          .get(`/api/complaints?search=${encodeURIComponent(payload)}`)
          .set('Authorization', `Bearer ${citizenToken}`)
          .expect(200);

        expect(res.body.success).to.be.true;
        expect(res.body.data.complaints).to.be.an('array');
      }
    });
  });
});
