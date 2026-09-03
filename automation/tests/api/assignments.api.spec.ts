import request from 'supertest';
import { expect } from 'chai';
import app from '../../../backend/src/app';
import { TestDataManager } from '../../utilities/TestDataManager';

describe('REST API Test Suite: Staff Triage & Assignment API', () => {
  const users = TestDataManager.getUsers();
  let adminToken: string;
  let staffToken: string;
  let citizenToken: string;
  let staffId: string;
  let complaintId: string;

  before(async () => {
    const admRes = await request(app)
      .post('/api/auth/login')
      .send({ email: users.validUsers.admin.email, password: users.validUsers.admin.password });
    adminToken = admRes.body.data.token;

    const stfRes = await request(app)
      .post('/api/auth/login')
      .send({ email: users.validUsers.staffRoads.email, password: users.validUsers.staffRoads.password });
    staffToken = stfRes.body.data.token;
    staffId = stfRes.body.data.user.id;

    const citRes = await request(app)
      .post('/api/auth/login')
      .send({ email: users.validUsers.citizen.email, password: users.validUsers.citizen.password });
    citizenToken = citRes.body.data.token;

    // Create a complaint to assign
    const catRes = await request(app).get('/api/categories');
    const catId = catRes.body.data.categories[0].id;

    const compRes = await request(app)
      .post('/api/complaints')
      .set('Authorization', `Bearer ${citizenToken}`)
      .send({
        title: 'Broken asphalt on 14th street bus lane',
        description: 'Heavy buses are deteriorating the outer lane asphalt surface.',
        categoryId: catId,
        location: '14th St & 3rd Ave',
      });
    complaintId = compRes.body.data.complaint.id;
  });

  describe('PATCH /api/complaints/:id/assign', () => {
    it('should allow Admin to assign a field technician to a complaint', async () => {
      const res = await request(app)
        .patch(`/api/complaints/${complaintId}/assign`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          staffId,
          notes: 'Urgent asphalt patching required before peak morning commute.',
        })
        .expect(200);

      expect(res.body.success).to.be.true;
      expect(res.body.data.complaint.assignedStaffId).to.equal(staffId);
      expect(res.body.data.complaint.status).to.equal('ASSIGNED');
    });

    it('should reject non-admin/non-staff assignment attempts (403 Forbidden)', async () => {
      const res = await request(app)
        .patch(`/api/complaints/${complaintId}/assign`)
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({ staffId })
        .expect(403);

      expect(res.body.success).to.be.false;
      expect(res.body.errorCode).to.equal('FORBIDDEN');
    });
  });

  describe('GET /api/admin/staff', () => {
    it('should return list of staff members for assignment modal', async () => {
      const res = await request(app)
        .get('/api/admin/staff')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).to.be.true;
      expect(res.body.data.staff).to.be.an('array');
      expect(res.body.data.staff.length).to.be.greaterThan(0);
    });
  });
});
