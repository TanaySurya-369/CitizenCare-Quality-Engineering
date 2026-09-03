import request from 'supertest';
import { expect } from 'chai';
import app from '../../../backend/src/app';
import { TokenManager } from '../utilities/TokenManager';
import { FeedbackPayloads } from '../payloads/complaints.payloads';

describe('Enterprise REST API: Citizen Feedback & Ratings', () => {
  let citizenToken: string;
  let staffToken: string;
  let complaintId: string;

  before(async () => {
    citizenToken = await TokenManager.getCitizenToken();
    staffToken = await TokenManager.getStaffToken();

    const catRes = await request(app).get('/api/categories');
    const catId = catRes.body.data.categories[0].id;

    // Create and resolve complaint
    const compRes = await request(app)
      .post('/api/complaints')
      .set('Authorization', `Bearer ${citizenToken}`)
      .send({
        title: 'Feedback Test: Water line leak',
        description: 'Water leaking onto asphalt from ruptured connection.',
        categoryId: catId,
        location: '900 Broadway',
      });
    complaintId = compRes.body.data.complaint.id;

    await request(app)
      .patch(`/api/complaints/${complaintId}/status`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send({ status: 'ACKNOWLEDGED', remarks: 'Acknowledged' });

    await request(app)
      .patch(`/api/complaints/${complaintId}/status`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send({ status: 'IN_PROGRESS', remarks: 'In progress' });

    await request(app)
      .patch(`/api/complaints/${complaintId}/status`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send({ status: 'RESOLVED', remarks: 'Connection tightened.' });
  });

  describe('POST /api/complaints/:id/feedback', () => {
    it('should submit 5-star feedback and transition status to CLOSED', async () => {
      const res = await request(app)
        .post(`/api/complaints/${complaintId}/feedback`)
        .set('Authorization', `Bearer ${citizenToken}`)
        .send(FeedbackPayloads.fiveStar)
        .expect(201);

      expect(res.body.success).to.be.true;
      expect(res.body.data.feedback.rating).to.equal(5);

      const checkRes = await request(app)
        .get(`/api/complaints/${complaintId}`)
        .set('Authorization', `Bearer ${citizenToken}`);
      expect(checkRes.body.data.complaint.status).to.equal('CLOSED');
    });

    it('should reject out-of-range rating with 400 Bad Request', async () => {
      const res = await request(app)
        .post(`/api/complaints/${complaintId}/feedback`)
        .set('Authorization', `Bearer ${citizenToken}`)
        .send(FeedbackPayloads.invalidOutOfRange)
        .expect(400);

      expect(res.body.success).to.be.false;
    });
  });
});
