import request from 'supertest';
import { expect } from 'chai';
import app from '../../../backend/src/app';
import { TokenManager } from '../utilities/TokenManager';

describe('Enterprise REST API: City Administration & Telemetry', () => {
  let adminToken: string;

  before(async () => {
    adminToken = await TokenManager.getAdminToken();
  });

  describe('GET /api/admin/analytics', () => {
    it('should aggregate system KPIs, SLA compliance rates, and department workload', async () => {
      const res = await request(app)
        .get('/api/admin/analytics')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).to.be.true;
      const kpis = res.body.data;
      expect(kpis).to.have.property('totalComplaints');
      expect(kpis).to.have.property('slaComplianceRate');
      expect(kpis).to.have.property('byDepartment');
      expect(kpis).to.have.property('byPriority');
    });
  });

  describe('GET /api/admin/audit-logs', () => {
    it('should retrieve immutable audit logs with pagination', async () => {
      const res = await request(app)
        .get('/api/admin/audit-logs?page=1&limit=20')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).to.be.true;
      expect(res.body.data.logs).to.be.an('array');
    });
  });

  describe('GET /api/admin/users', () => {
    it('should retrieve system user directory for administrator', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).to.be.true;
      expect(res.body.data.users).to.be.an('array');
    });
  });
});
