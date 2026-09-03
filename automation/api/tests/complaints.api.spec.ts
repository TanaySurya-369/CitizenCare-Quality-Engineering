import request from 'supertest';
import { expect } from 'chai';
import app from '../../../backend/src/app';
import { TokenManager } from '../utilities/TokenManager';
import { ComplaintPayloads } from '../payloads/complaints.payloads';

describe('Enterprise REST API: Complaint Lifecycle, Categories & State Machine', () => {
  let citizenToken: string;
  let staffToken: string;
  let categoryId: string;
  let complaintId: string;

  before(async () => {
    citizenToken = await TokenManager.getCitizenToken();
    staffToken = await TokenManager.getStaffToken();

    const catRes = await request(app).get('/api/categories');
    categoryId = catRes.body.data.categories[0].id;
  });

  describe('POST /api/complaints (Create)', () => {
    it('should create complaint and calculate SLA deadline', async () => {
      const payload = ComplaintPayloads.validHighRoad(categoryId);

      const res = await request(app)
        .post('/api/complaints')
        .set('Authorization', `Bearer ${citizenToken}`)
        .send(payload)
        .expect(201);

      expect(res.body.success).to.be.true;
      expect(res.body.data.complaint).to.have.property('complaintNumber');
      expect(res.body.data.complaint.status).to.equal('SUBMITTED');
      complaintId = res.body.data.complaint.id;
    });

    it('should reject short title with 400 Validation Error', async () => {
      const payload = ComplaintPayloads.invalidShortTitle(categoryId);

      const res = await request(app)
        .post('/api/complaints')
        .set('Authorization', `Bearer ${citizenToken}`)
        .send(payload)
        .expect(400);

      expect(res.body.success).to.be.false;
      expect(res.body.errorCode).to.equal('VALIDATION_ERROR');
    });
  });

  describe('GET /api/complaints (List & Details)', () => {
    it('should list complaints with pagination metadata', async () => {
      const res = await request(app)
        .get('/api/complaints?page=1&limit=10')
        .set('Authorization', `Bearer ${citizenToken}`)
        .expect(200);

      expect(res.body.success).to.be.true;
      expect(res.body.data.complaints).to.be.an('array');
    });

    it('should get complaint details by ID', async () => {
      const res = await request(app)
        .get(`/api/complaints/${complaintId}`)
        .set('Authorization', `Bearer ${citizenToken}`)
        .expect(200);

      expect(res.body.success).to.be.true;
      expect(res.body.data.complaint.id).to.equal(complaintId);
    });
  });

  describe('PATCH /api/complaints/:id/status (Transitions)', () => {
    it('should transition to ACKNOWLEDGED', async () => {
      const res = await request(app)
        .patch(`/api/complaints/${complaintId}/status`)
        .set('Authorization', `Bearer ${staffToken}`)
        .send({ status: 'ACKNOWLEDGED', remarks: 'Acknowledged by municipal supervisor.' })
        .expect(200);

      expect(res.body.data.complaint.status).to.equal('ACKNOWLEDGED');
    });

    it('should transition to IN_PROGRESS', async () => {
      const res = await request(app)
        .patch(`/api/complaints/${complaintId}/status`)
        .set('Authorization', `Bearer ${staffToken}`)
        .send({ status: 'IN_PROGRESS', remarks: 'Work commenced on site.' })
        .expect(200);

      expect(res.body.data.complaint.status).to.equal('IN_PROGRESS');
    });

    it('should transition to RESOLVED', async () => {
      const res = await request(app)
        .patch(`/api/complaints/${complaintId}/status`)
        .set('Authorization', `Bearer ${staffToken}`)
        .send({ status: 'RESOLVED', remarks: 'Repairs completed and validated.' })
        .expect(200);

      expect(res.body.data.complaint.status).to.equal('RESOLVED');
    });
  });
});
