import request from 'supertest';
import { expect } from 'chai';
import app from '../../../backend/src/app';
import { TestDataManager } from '../../utilities/TestDataManager';

describe('REST API Test Suite: Citizen Feedback & Rating Management', () => {
  const users = TestDataManager.getUsers();
  let citizenToken: string;
  let staffToken: string;
  let complaintId: string;

  before(async () => {
    const citRes = await request(app)
      .post('/api/auth/login')
      .send({ email: users.validUsers.citizen.email, password: users.validUsers.citizen.password });
    citizenToken = citRes.body.data.token;

    const stfRes = await request(app)
      .post('/api/auth/login')
      .send({ email: users.validUsers.staffRoads.email, password: users.validUsers.staffRoads.password });
    staffToken = stfRes.body.data.token;

    // Create complaint
    const catRes = await request(app).get('/api/categories');
    const catId = catRes.body.data.categories[0].id;

    const compRes = await request(app)
      .post('/api/complaints')
      .set('Authorization', `Bearer ${citizenToken}`)
      .send({
        title: 'Feedback Test: Damaged sidewalk curb',
        description: 'Broken curb creating accessibility difficulty for wheelchairs.',
        categoryId: catId,
        location: '10th Ave',
      });
    complaintId = compRes.body.data.complaint.id;
  });

  describe('POST /api/complaints/:id/feedback', () => {
    it('should reject feedback if complaint is still in SUBMITTED or IN_PROGRESS status', async () => {
      const res = await request(app)
        .post(`/api/complaints/${complaintId}/feedback`)
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({
          rating: 5,
          comment: 'Too early to review',
        })
        .expect(400);

      expect(res.body.success).to.be.false;
      expect(res.body.errorCode).to.equal('COMPLAINT_NOT_RESOLVED');
    });

    it('should successfully submit 5-star rating after complaint is marked RESOLVED and auto-close complaint', async () => {
      // Progress to RESOLVED
      await request(app)
        .patch(`/api/complaints/${complaintId}/status`)
        .set('Authorization', `Bearer ${staffToken}`)
        .send({ status: 'ACKNOWLEDGED' });

      await request(app)
        .patch(`/api/complaints/${complaintId}/status`)
        .set('Authorization', `Bearer ${staffToken}`)
        .send({ status: 'IN_PROGRESS' });

      await request(app)
        .patch(`/api/complaints/${complaintId}/status`)
        .set('Authorization', `Bearer ${staffToken}`)
        .send({ status: 'RESOLVED', remarks: 'Sidewalk curb rebuilt with ramp.' });

      // Now submit 5-star feedback
      const feedbackRes = await request(app)
        .post(`/api/complaints/${complaintId}/feedback`)
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({
          rating: 5,
          comment: 'Exceptional workmanship and fast turnaround time!',
          resolutionConfirmed: true,
        })
        .expect(201);

      expect(feedbackRes.body.success).to.be.true;
      expect(feedbackRes.body.data.feedback.rating).to.equal(5);

      // Verify complaint is now marked CLOSED
      const checkRes = await request(app)
        .get(`/api/complaints/${complaintId}`)
        .set('Authorization', `Bearer ${citizenToken}`);

      expect(checkRes.body.data.complaint.status).to.equal('CLOSED');
      expect(checkRes.body.data.complaint.feedback).to.not.be.null;
    });

    it('should reject duplicate feedback submission on the same complaint (409 Conflict)', async () => {
      const res = await request(app)
        .post(`/api/complaints/${complaintId}/feedback`)
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({
          rating: 4,
          comment: 'Duplicate attempt',
        })
        .expect(409);

      expect(res.body.success).to.be.false;
      expect(res.body.errorCode).to.equal('FEEDBACK_ALREADY_EXISTS');
    });

    it('should reject boundary ratings outside 1-5 range (e.g. rating 0 or 6)', async () => {
      const res = await request(app)
        .post(`/api/complaints/${complaintId}/feedback`)
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({
          rating: 6,
        })
        .expect(400);

      expect(res.body.success).to.be.false;
      expect(res.body.errorCode).to.equal('VALIDATION_ERROR');
    });
  });
});
