import request from 'supertest';
import { expect } from 'chai';
import app from '../../backend/src/app';
import { TokenManager } from '../api/utilities/TokenManager';

describe('Security & RBAC Test Suite: Role Isolation & Barriers', () => {
  let citizenToken: string;
  let staffToken: string;

  before(async () => {
    citizenToken = await TokenManager.getCitizenToken();
    staffToken = await TokenManager.getStaffToken();
  });

  describe('Citizen Privilege Escalation Barriers', () => {
    it('should reject Citizen accessing Admin Analytics with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/admin/analytics')
        .set('Authorization', `Bearer ${citizenToken}`)
        .expect(403);

      expect(res.body.success).to.be.false;
      expect(res.body.errorCode).to.equal('FORBIDDEN');
    });

    it('should reject Citizen accessing Admin Audit Logs with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/admin/audit-logs')
        .set('Authorization', `Bearer ${citizenToken}`)
        .expect(403);

      expect(res.body.success).to.be.false;
      expect(res.body.errorCode).to.equal('FORBIDDEN');
    });

    it('should reject Citizen attempting to assign technicians to complaints (403 Forbidden)', async () => {
      const res = await request(app)
        .patch('/api/complaints/dummy-uuid/assign')
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({ staffId: 'dummy-staff' })
        .expect(403);

      expect(res.body.success).to.be.false;
      expect(res.body.errorCode).to.equal('FORBIDDEN');
    });
  });
});
