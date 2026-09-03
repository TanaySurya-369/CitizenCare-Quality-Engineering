import request from 'supertest';
import { expect } from 'chai';
import app from '../../../backend/src/app';
import { TestDataManager } from '../../utilities/TestDataManager';

describe('REST API Test Suite: Complaints Management & SLA Lifecycle', () => {
  const users = TestDataManager.getUsers();
  let citizenToken: string;
  let staffToken: string;
  let adminToken: string;
  let categoryId: string;
  let createdComplaintId: string;
  let createdComplaintNumber: string;

  before(async () => {
    // Acquire tokens
    const citRes = await request(app)
      .post('/api/auth/login')
      .send({ email: users.validUsers.citizen.email, password: users.validUsers.citizen.password });
    citizenToken = citRes.body.data.token;

    const staffRes = await request(app)
      .post('/api/auth/login')
      .send({ email: users.validUsers.staffRoads.email, password: users.validUsers.staffRoads.password });
    staffToken = staffRes.body.data.token;

    const admRes = await request(app)
      .post('/api/auth/login')
      .send({ email: users.validUsers.admin.email, password: users.validUsers.admin.password });
    adminToken = admRes.body.data.token;

    // Fetch a category ID
    const catRes = await request(app).get('/api/categories');
    categoryId = catRes.body.data.categories[0].id;
  });

  describe('POST /api/complaints (Create Complaint)', () => {
    it('should successfully create a new complaint and calculate SLA deadline', async () => {
      const payload = {
        title: 'Dangerous Road Subsidence near 8th Ave',
        description: 'Pavement has sunken by 6 inches over the sewer line, causing dangerous vehicle bottom-out.',
        categoryId,
        location: '8th Ave & 23rd St Junction, South Zone',
        priority: 'HIGH',
        latitude: 40.745,
        longitude: -73.992,
      };

      const res = await request(app)
        .post('/api/complaints')
        .set('Authorization', `Bearer ${citizenToken}`)
        .send(payload)
        .expect(201);

      expect(res.body.success).to.be.true;
      const comp = res.body.data.complaint;
      expect(comp).to.have.property('id');
      expect(comp).to.have.property('complaintNumber');
      expect(comp.title).to.equal(payload.title);
      expect(comp.status).to.equal('SUBMITTED');
      expect(comp.priority).to.equal('HIGH');
      expect(comp).to.have.property('expectedResolutionDate');
      expect(comp.slaInfo).to.have.property('state');

      createdComplaintId = comp.id;
      createdComplaintNumber = comp.complaintNumber;
    });

    it('should reject complaint creation when title is missing or less than 5 characters', async () => {
      const payload = {
        title: 'Hole', // < 5 chars
        description: 'Valid long description of the issue that happened on the road.',
        categoryId,
        location: 'Main St',
      };

      const res = await request(app)
        .post('/api/complaints')
        .set('Authorization', `Bearer ${citizenToken}`)
        .send(payload)
        .expect(400);

      expect(res.body.success).to.be.false;
      expect(res.body.errorCode).to.equal('VALIDATION_ERROR');
    });

    it('should reject complaint creation when non-existent category is provided', async () => {
      const payload = {
        title: 'Valid Complaint Title',
        description: 'Valid long description of the issue on the avenue.',
        categoryId: 'non-existent-cat-uuid',
        location: 'Main St',
      };

      const res = await request(app)
        .post('/api/complaints')
        .set('Authorization', `Bearer ${citizenToken}`)
        .send(payload)
        .expect(404);

      expect(res.body.success).to.be.false;
      expect(res.body.errorCode).to.equal('CATEGORY_NOT_FOUND');
    });
  });

  describe('GET /api/complaints (List & Filter)', () => {
    it('should return list of complaints for citizen', async () => {
      const res = await request(app)
        .get('/api/complaints')
        .set('Authorization', `Bearer ${citizenToken}`)
        .expect(200);

      expect(res.body.success).to.be.true;
      expect(res.body.data).to.have.property('complaints');
      expect(res.body.data.complaints).to.be.an('array');
      expect(res.body.data.total).to.be.greaterThan(0);
    });

    it('should allow filtering complaints by status and search keyword', async () => {
      const res = await request(app)
        .get('/api/complaints?status=SUBMITTED&search=Subsidence')
        .set('Authorization', `Bearer ${citizenToken}`)
        .expect(200);

      expect(res.body.success).to.be.true;
      expect(res.body.data.complaints).to.be.an('array');
    });
  });

  describe('GET /api/complaints/:id (Details)', () => {
    it('should retrieve complaint details by UUID', async () => {
      const res = await request(app)
        .get(`/api/complaints/${createdComplaintId}`)
        .set('Authorization', `Bearer ${citizenToken}`)
        .expect(200);

      expect(res.body.success).to.be.true;
      expect(res.body.data.complaint.id).to.equal(createdComplaintId);
      expect(res.body.data.complaint.statusHistory).to.be.an('array');
    });

    it('should retrieve complaint details by complaintNumber (e.g. C-1001)', async () => {
      const res = await request(app)
        .get(`/api/complaints/${createdComplaintNumber}`)
        .set('Authorization', `Bearer ${citizenToken}`)
        .expect(200);

      expect(res.body.success).to.be.true;
      expect(res.body.data.complaint.complaintNumber).to.equal(createdComplaintNumber);
    });
  });

  describe('PATCH /api/complaints/:id/status (State Machine Transitions)', () => {
    it('should allow staff to update status to IN_PROGRESS with remarks', async () => {
      const res = await request(app)
        .patch(`/api/complaints/${createdComplaintId}/status`)
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          status: 'ACKNOWLEDGED',
          remarks: 'Complaint reviewed by road inspection supervisor.',
        })
        .expect(200);

      expect(res.body.success).to.be.true;
      expect(res.body.data.complaint.status).to.equal('ACKNOWLEDGED');
    });

    it('should reject invalid status transitions (e.g. from ACKNOWLEDGED directly to CLOSED)', async () => {
      const res = await request(app)
        .patch(`/api/complaints/${createdComplaintId}/status`)
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          status: 'CLOSED',
        })
        .expect(400);

      expect(res.body.success).to.be.false;
      expect(res.body.errorCode).to.equal('INVALID_STATUS_TRANSITION');
    });

    it('should reject citizen attempts to update complaint status (403 Forbidden)', async () => {
      const res = await request(app)
        .patch(`/api/complaints/${createdComplaintId}/status`)
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({
          status: 'IN_PROGRESS',
        })
        .expect(403);

      expect(res.body.success).to.be.false;
      expect(res.body.errorCode).to.equal('FORBIDDEN');
    });
  });
});
